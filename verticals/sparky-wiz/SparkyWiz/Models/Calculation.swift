import Foundation
import GRDB

struct Calculation: Codable, FetchableRecord, PersistableRecord {
    var id: UUID
    var type: String
    var inputJson: String
    var resultJson: String
    var version: Int
    var createdAt: Date
    var updatedAt: Date
}

struct SyncQueueItem: Codable, FetchableRecord, PersistableRecord {
    var id: UUID
    var tableName: String
    var recordId: UUID
    var operation: String
    var payload: String
    var createdAt: Date
    var status: String
}

struct Job: Codable, FetchableRecord, PersistableRecord {
    var id: String
    var name: String
    var notes: String?
    var createdAt: Date
    var updatedAt: Date
    var versionNumber: Int?
}
