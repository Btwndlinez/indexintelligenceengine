import Foundation
import GRDB

struct WireProperty: Codable, FetchableRecord, MutablePersistableRecord {
    var wireSize: String
    var material: String
    var resistancePerKFT: Double
    var areaCirMils: Double
    var thhnAreaSqIn: Double

    static let databaseTableName = "wireProperty"
}

struct ConduitProperty: Codable, FetchableRecord, MutablePersistableRecord {
    var conduitType: String
    var tradeSize: String
    var internalAreaSqIn: Double

    static let databaseTableName = "conduitProperty"
}

class DatabaseManager {
    static let shared = DatabaseManager()
    let dbQueue: DatabaseQueue

    private init() {
        do {
            let fileManager = FileManager.default
            let appSupportURL = try fileManager.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            let dbURL = appSupportURL.appendingPathComponent("wiringcode.sqlite")

            dbQueue = try DatabaseQueue(path: dbURL.path)

            try dbQueue.write { db in
                try db.create(table: "calculation", ifNotExists: true) { t in
                    t.column("id", .text).primaryKey()
                    t.column("type", .text).notNull()
                    t.column("inputJson", .text).notNull()
                    t.column("resultJson", .text).notNull()
                    t.column("version", .integer).notNull().defaults(to: 1)
                    t.column("createdAt", .datetime).notNull()
                    t.column("updatedAt", .datetime).notNull()
                }

                try db.create(table: "job", ifNotExists: true) { t in
                    t.column("id", .text).primaryKey()
                    t.column("name", .text).notNull()
                    t.column("notes", .text)
                    t.column("createdAt", .datetime).notNull()
                    t.column("updatedAt", .datetime).notNull()
                    t.column("versionNumber", .integer).defaults(to: 1)
                }

                try db.create(table: "syncQueue", ifNotExists: true) { t in
                    t.column("id", .text).primaryKey()
                    t.column("tableName", .text).notNull()
                    t.column("recordId", .text).notNull()
                    t.column("operation", .text).notNull()
                    t.column("payload", .text).notNull()
                    t.column("createdAt", .datetime).notNull()
                    t.column("status", .text).notNull().defaults(to: "pending")
                }

                try db.create(table: "wireProperty", ifNotExists: true) { t in
                    t.column("wireSize", .text).notNull()
                    t.column("material", .text).notNull()
                    t.column("resistancePerKFT", .double).notNull()
                    t.column("areaCirMils", .double).notNull()
                    t.column("thhnAreaSqIn", .double).notNull()
                    t.primaryKey(["wireSize", "material"])
                }

                try db.create(table: "conduitProperty", ifNotExists: true) { t in
                    t.column("conduitType", .text).notNull()
                    t.column("tradeSize", .text).notNull()
                    t.column("internalAreaSqIn", .double).notNull()
                    t.primaryKey(["conduitType", "tradeSize"])
                }

                if try WireProperty.fetchCount(db) == 0 {
                    try seedNECTables(db: db)
                }
            }
        } catch {
            fatalError("Database initialization failed: \(error)")
        }
    }

    private func seedNECTables(db: Database) throws {
        let wireData: [WireProperty] = [
            WireProperty(wireSize: "#14", material: "Copper", resistancePerKFT: 3.14, areaCirMils: 4110, thhnAreaSqIn: 0.0097),
            WireProperty(wireSize: "#12", material: "Copper", resistancePerKFT: 1.98, areaCirMils: 6530, thhnAreaSqIn: 0.0133),
            WireProperty(wireSize: "#10", material: "Copper", resistancePerKFT: 1.24, areaCirMils: 10380, thhnAreaSqIn: 0.0211),
            WireProperty(wireSize: "#8", material: "Copper", resistancePerKFT: 0.778, areaCirMils: 16510, thhnAreaSqIn: 0.0366),
            WireProperty(wireSize: "#6", material: "Copper", resistancePerKFT: 0.491, areaCirMils: 26240, thhnAreaSqIn: 0.0507),

            WireProperty(wireSize: "#14", material: "Aluminum", resistancePerKFT: 5.17, areaCirMils: 4110, thhnAreaSqIn: 0.0097),
            WireProperty(wireSize: "#12", material: "Aluminum", resistancePerKFT: 3.26, areaCirMils: 6530, thhnAreaSqIn: 0.0133),
            WireProperty(wireSize: "#10", material: "Aluminum", resistancePerKFT: 2.04, areaCirMils: 10380, thhnAreaSqIn: 0.0211),
            WireProperty(wireSize: "#8", material: "Aluminum", resistancePerKFT: 1.28, areaCirMils: 16510, thhnAreaSqIn: 0.0366),
            WireProperty(wireSize: "#6", material: "Aluminum", resistancePerKFT: 0.808, areaCirMils: 26240, thhnAreaSqIn: 0.0507),
        ]

        let conduitData: [ConduitProperty] = [
            ConduitProperty(conduitType: "EMT", tradeSize: "1/2", internalAreaSqIn: 0.122),
            ConduitProperty(conduitType: "EMT", tradeSize: "3/4", internalAreaSqIn: 0.213),
            ConduitProperty(conduitType: "EMT", tradeSize: "1", internalAreaSqIn: 0.346),
            ConduitProperty(conduitType: "RMC", tradeSize: "1/2", internalAreaSqIn: 0.126),
            ConduitProperty(conduitType: "RMC", tradeSize: "3/4", internalAreaSqIn: 0.209),
            ConduitProperty(conduitType: "RMC", tradeSize: "1", internalAreaSqIn: 0.347),
        ]

        for wire in wireData { try wire.insert(db) }
        for conduit in conduitData { try conduit.insert(db) }
    }

    func fetchWireProperty(size: String, material: String) throws -> WireProperty? {
        try dbQueue.read { db in
            try WireProperty
                .filter(Column("wireSize") == size)
                .filter(Column("material") == material)
                .fetchOne(db)
        }
    }

    func fetchPendingSyncItems() throws -> [SyncQueueItem] {
        try dbQueue.read { db in
            try SyncQueueItem
                .filter(Column("status") == "pending")
                .order(Column("createdAt").asc)
                .fetchAll(db)
        }
    }

    func fetchCalculationPayload(id: UUID) throws -> Calculation? {
        try dbQueue.read { db in
            try Calculation.filter(Column("id") == id.uuidString).fetchOne(db)
        }
    }

    func deleteSyncQueueItem(id: UUID) throws {
        try dbQueue.write { db in
            try SyncQueueItem.deleteOne(db, key: ["id": id.uuidString])
        }
    }

    func markSyncQueueItemAsConflicted(id: UUID) throws {
        try dbQueue.write { db in
            if var item = try SyncQueueItem.fetchOne(db, key: ["id": id.uuidString]) {
                item.status = "conflict"
                try item.update(db)
            }
        }
    }

    func fetchConduitProperty(type: String, size: String) throws -> ConduitProperty? {
        try dbQueue.read { db in
            try ConduitProperty
                .filter(Column("conduitType") == type)
                .filter(Column("tradeSize") == size)
                .fetchOne(db)
        }
    }

    func saveCalculation(type: String, input: some Encodable, result: some Encodable) throws {
        let encoder = JSONEncoder()
        let inputData = try encoder.encode(input)
        let resultData = try encoder.encode(result)

        let id = UUID()
        let now = Date()

        let calculation = Calculation(
            id: id,
            type: type,
            inputJson: String(data: inputData, encoding: .utf8)!,
            resultJson: String(data: resultData, encoding: .utf8)!,
            version: 1,
            createdAt: now,
            updatedAt: now
        )

        try dbQueue.write { db in
            try calculation.insert(db)

            let syncItem = SyncQueueItem(
                id: UUID(),
                tableName: "calculation",
                recordId: id,
                operation: "INSERT",
                payload: String(data: inputData, encoding: .utf8)!,
                createdAt: now,
                status: "pending"
            )
            try syncItem.insert(db)
        }
    }

    func fetchRecentCalculations(limit: Int = 10) throws -> [Calculation] {
        try dbQueue.read { db in
            try Calculation
                .order(Column("createdAt").desc)
                .limit(limit)
                .fetchAll(db)
        }
    }

    func fetchAllCalculations() throws -> [Calculation] {
        try dbQueue.read { db in
            try Calculation.fetchAll(db)
        }
    }

    func saveJob(name: String, notes: String?) throws -> Job {
        let id = UUID().uuidString
        let now = Date()
        let job = Job(id: id, name: name, notes: notes, createdAt: now, updatedAt: now, versionNumber: 1)

        try dbQueue.write { db in
            try job.insert(db)
        }
        return job
    }

    func fetchJobs() throws -> [Job] {
        try dbQueue.read { db in
            try Job.order(Column("updatedAt").desc).fetchAll(db)
        }
    }
}
