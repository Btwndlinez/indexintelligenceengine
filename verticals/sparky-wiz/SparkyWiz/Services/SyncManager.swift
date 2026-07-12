import Foundation
import Supabase

enum SyncError: Error {
    case versionConflict(serverVersion: Int, localVersion: Int)
}

class SyncManager {
    static let shared = SyncManager()

    private let supabase = SupabaseClient(
        supabaseURL: URL(string: "https://xqinuxagcxojhzkaxpya.supabase.co")!,
        supabaseKey: "sb_publishable_mrn6ua6Z9IxzsyLaJaw_9Fasq9PK"
    )

    private var syncTask: Task<Void, Never>?

    private init() {
        startObservingNetwork()
    }

    private func startObservingNetwork() {
        syncTask = Task { [weak self] in
            for await isConnected in NetworkMonitor.shared.$isConnected.values {
                guard let self else { return }
                if isConnected {
                    await self.pushQueue()
                }
            }
        }
    }

    private func pushQueue() async {
        do {
            let pendingItems = try DatabaseManager.shared.fetchPendingSyncItems()
            guard !pendingItems.isEmpty else { return }

            for item in pendingItems {
                guard let calculation = try DatabaseManager.shared.fetchCalculationPayload(id: item.recordId) else {
                    try DatabaseManager.shared.deleteSyncQueueItem(id: item.id)
                    continue
                }

                do {
                    try await pushCalculationToSupabase(calculation)
                    try DatabaseManager.shared.deleteSyncQueueItem(id: item.id)
                } catch let error as SyncError {
                    try DatabaseManager.shared.markSyncQueueItemAsConflicted(id: item.id)
                } catch {
                    break
                }
            }
        } catch {
            print("Sync error: \(error.localizedDescription)")
        }
    }

    private func pushCalculationToSupabase(_ calculation: Calculation) async throws {
        let checkResponse = try await supabase.database
            .from("calculations")
            .select("version")
            .eq("id", value: calculation.id.uuidString)
            .execute()

        let jsonString = String(data: checkResponse.data, encoding: .utf8) ?? "[]"

        if jsonString == "[]" || jsonString == "null" {
            let payload: [String: Any] = [
                "id": calculation.id.uuidString,
                "type": calculation.type,
                "input_json": calculation.inputJson,
                "result_json": calculation.resultJson,
                "version": 1,
                "created_at": calculation.createdAt.ISO8601Format(),
                "updated_at": calculation.updatedAt.ISO8601Format()
            ]
            try await supabase.database
                .from("calculations")
                .insert(payload)
                .execute()
            return
        }

        let updateResponse = try await supabase.database
            .from("calculations")
            .update([
                "input_json": calculation.inputJson,
                "result_json": calculation.resultJson,
                "updated_at": calculation.updatedAt.ISO8601Format()
            ])
            .eq("id", value: calculation.id.uuidString)
            .eq("version", value: calculation.version)
            .select()
            .execute()

        let updateJson = String(data: updateResponse.data, encoding: .utf8) ?? "[]"

        if updateJson == "[]" || updateJson == "null" {
            throw SyncError.versionConflict(serverVersion: -1, localVersion: calculation.version)
        }
    }
}
