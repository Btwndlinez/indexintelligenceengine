import Foundation
import Network
import GRDB

class SyncEngine {
    static let shared = SyncEngine()

    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "com.wiringcode.sync", qos: .background)
    private var isOnline = false

    private init() {
        monitor.pathUpdateHandler = { [weak self] path in
            self?.isOnline = path.status == .satisfied
            if path.status == .satisfied {
                self?.processQueue()
            }
        }
        monitor.start(queue: queue)
    }

    func processQueue() {
        guard isOnline else { return }

        do {
            let pendingItems: [SyncQueueItem] = try DatabaseManager.shared.dbQueue.read { db in
                try SyncQueueItem
                    .filter(Column("status") == "pending")
                    .order(Column("createdAt").asc)
                    .fetchAll(db)
            }

            for item in pendingItems {
                pushToSupabase(item)
            }
        } catch {
            print("Sync queue read failed: \(error)")
        }
    }

    private func pushToSupabase(_ item: SyncQueueItem) {
        // TODO: Implement Supabase push via supabase-swift SDK
        // 1. Build request from payload
        // 2. Send to Supabase REST endpoint
        // 3. On success: mark item.status = "synced"
        // 4. On conflict (Contractor tier): handle version_number mismatch
        // 5. On failure: leave as "pending" for retry

        print("Syncing \(item.operation) on \(item.tableName):\(item.recordId)")
        markSynced(item.id)
    }

    private func markSynced(_ id: String) {
        do {
            try DatabaseManager.shared.dbQueue.write { db in
                try db.execute(sql: "UPDATE syncQueue SET status = 'synced' WHERE id = ?", arguments: [id])
            }
        } catch {
            print("Failed to mark sync item synced: \(error)")
        }
    }

    deinit {
        monitor.cancel()
    }
}
