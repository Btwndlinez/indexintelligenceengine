import Foundation

// MARK: - Voltage Drop

struct VoltageDropInput: Codable {
    let voltage: Double
    let amperage: Double
    let oneWayLength: Double
    let phase: Int
    let resistancePerKFT: Double
}

struct VoltageDropResult: Codable {
    let voltageDrop: Double
    let voltageAtEnd: Double
    let dropPercentage: Double
    let meetsNEC: Bool
}

// MARK: - Conduit Fill

struct WireEntry: Codable, Hashable {
    let size: String
    let quantity: Int
}

struct ConduitFillInput: Codable {
    let conduitType: String
    let conduitSize: String
    let wires: [WireEntry]
}

struct ConduitFillResult: Codable {
    let totalWireArea: Double
    let maxAllowedArea: Double
    let fillPercentage: Double
    let maxFillPercentage: Double
    let isCompliant: Bool
}

// MARK: - Box Fill

struct BoxFillInput: Codable {
    let boxType: String
    let boxSize: String
    let conductorCount: Int
    let clampCount: Int
    let supportFittings: Int
    let deviceCount: Int
    let equipmentGrounds: Int
}

struct BoxFillResult: Codable {
    let totalVolumeAllowance: Double
    let availableVolume: Double
    let remainingVolume: Double
    let isOverfilled: Bool
}

// MARK: - Ampacity

struct AmpacityInput: Codable {
    let wireSize: String
    let insulationType: String
    let temperatureRating: Int
    let ambientTemp: Double
    let conduitFillCount: Int
    let isUnderground: Bool
}

struct AmpacityResult: Codable {
    let baseAmpacity: Double
    let tempDeratingFactor: Double
    let conduitFillDeratingFactor: Double
    let adjustedAmpacity: Double
    let recommendedBreakerSize: Int
}

// MARK: - Bending

struct BendingInput: Codable {
    let conduitType: String
    let conduitSize: String
    let bendAngle: Double
    let stubLength: Double?
    let offsetHeight: Double?
}

struct BendingResult: Codable {
    let shrink: Double
    let bendMark: Double
    let takeUp: Double
    let totalLength: Double
}

// MARK: - Engine

enum CalculatorEngine {

    static func voltageDrop(input: VoltageDropInput) -> VoltageDropResult {
        let lengthFactor = input.phase == 1 ? 2.0 : 1.732
        let vd = (lengthFactor * input.oneWayLength * input.resistancePerKFT * input.amperage) / 1000.0
        let vEnd = input.voltage - vd
        let pct = (vd / input.voltage) * 100.0

        return VoltageDropResult(
            voltageDrop: max(vd, 0),
            voltageAtEnd: max(vEnd, 0),
            dropPercentage: max(pct, 0),
            meetsNEC: pct <= 3.0
        )
    }

    static func calculateConduitFill(input: ConduitFillInput, wireAreas: [String: Double], conduitArea: Double) -> ConduitFillResult {
        var totalWireArea = 0.0
        var totalWireCount = 0

        for wire in input.wires {
            if let area = wireAreas[wire.size] {
                totalWireArea += area * Double(wire.quantity)
                totalWireCount += wire.quantity
            }
        }

        let maxFillPercentage: Double
        switch totalWireCount {
        case 1: maxFillPercentage = 0.53
        case 2: maxFillPercentage = 0.31
        default: maxFillPercentage = 0.40
        }

        let maxAllowedArea = conduitArea * maxFillPercentage
        let fillPercentage = totalWireArea / conduitArea
        let isCompliant = totalWireArea <= maxAllowedArea

        return ConduitFillResult(
            totalWireArea: totalWireArea,
            maxAllowedArea: maxAllowedArea,
            fillPercentage: fillPercentage,
            maxFillPercentage: maxFillPercentage,
            isCompliant: isCompliant
        )
    }

    static func boxFill(input: BoxFillInput) -> BoxFillResult {
        let conductorAllowance: Double = 2.0
        let totalAllowance = (Double(input.conductorCount) * conductorAllowance)
            + (Double(input.clampCount) * 1.0)
            + (Double(input.supportFittings) * 1.0)
            + (Double(input.deviceCount) * 2.0)
            + (Double(input.equipmentGrounds) * 1.0)

        let available = boxAvailableVolume(boxType: input.boxType, size: input.boxSize)
        let remaining = available - totalAllowance

        return BoxFillResult(
            totalVolumeAllowance: totalAllowance,
            availableVolume: available,
            remainingVolume: remaining,
            isOverfilled: remaining < 0
        )
    }

    static func ampacity(input: AmpacityInput) -> AmpacityResult {
        var base = baseAmpacity(wireSize: input.wireSize, insulationType: input.insulationType, tempRating: input.temperatureRating)
        let tempFactor = temperatureDerating(ambientTemp: input.ambientTemp, insulationType: input.insulationType)
        let fillFactor = conduitFillDerating(conductorCount: input.conduitFillCount)
        let adjusted = base * tempFactor * fillFactor
        let breaker = nearestBreakerSize(adjusted)
        base = base * tempFactor

        return AmpacityResult(
            baseAmpacity: base,
            tempDeratingFactor: tempFactor,
            conduitFillDeratingFactor: fillFactor,
            adjustedAmpacity: adjusted,
            recommendedBreakerSize: breaker
        )
    }

    static func bending(input: BendingInput) -> BendingResult {
        let tu = takeUp(conduitSize: input.conduitSize)
        let shrinkFactor: Double = input.bendAngle == 30 ? 0.25 : input.bendAngle == 45 ? 0.414 : input.bendAngle == 60 ? 0.577 : 0

        let shrink: Double
        let bendMark: Double
        let totalLength: Double

        if let stub = input.stubLength {
            bendMark = stub + tu
            totalLength = bendMark
            shrink = 0
        } else if let offset = input.offsetHeight {
            let distance = offset / sin(input.bendAngle * .pi / 180)
            shrink = offset * shrinkFactor
            bendMark = 0
            totalLength = distance + shrink
        } else {
            shrink = 0
            bendMark = 0
            totalLength = 0
        }

        return BendingResult(
            shrink: shrink,
            bendMark: bendMark,
            takeUp: tu,
            totalLength: totalLength
        )
    }
}

// MARK: - Private Lookup Tables

private func boxAvailableVolume(boxType: String, size: String) -> Double {
    let table: [String: Double] = [
        "4x4x1.5": 21.0, "4x4x2.125": 30.3, "4x4x2.25": 32.0,
        "4-11/16x1.5": 29.5, "4-11/16x2.125": 42.0,
        "3x2x1.5": 7.5, "3x2x2": 10.0, "3x2x2.25": 10.5,
        "3x2x2.5": 12.0, "3x2x3": 14.0,
        "4x2x1.5": 10.0, "4x2x1.5": 10.0,
        "onegang": 18.0, "twogang": 34.0, "threegang": 50.0, "fourgang": 66.0
    ]
    return table[size, default: 18.0]
}

private func baseAmpacity(wireSize: String, insulationType: String, tempRating: Int) -> Double {
    let table75C: [String: Double] = [
        "14": 20, "12": 25, "10": 35, "8": 50, "6": 65,
        "4": 85, "3": 100, "2": 115, "1": 130, "1/0": 150,
        "2/0": 175, "3/0": 200, "4/0": 230, "250": 255,
        "300": 285, "350": 310, "400": 335, "500": 380,
        "600": 420, "750": 475, "1000": 545
    ]
    let table90C: [String: Double] = [
        "14": 25, "12": 30, "10": 40, "8": 55, "6": 75,
        "4": 95, "3": 110, "2": 130, "1": 150, "1/0": 170,
        "2/0": 195, "3/0": 225, "4/0": 260, "250": 290,
        "300": 320, "350": 350, "400": 380, "500": 430,
        "600": 475, "750": 535, "1000": 615
    ]
    let key = wireSize.replacingOccurrences(of: "#", with: "")
    if tempRating == 90 { return table90C[key, default: 0] }
    if tempRating == 60 { return table75C[key, default: 0] * 0.8 }
    return table75C[key, default: 0]
}

private func temperatureDerating(ambientTemp: Double, insulationType: String) -> Double {
    guard ambientTemp > 30 else { return 1.0 }
    switch ambientTemp {
    case 31...40: return 0.91
    case 41...45: return 0.82
    case 46...50: return 0.71
    case 51...55: return 0.58
    case 56...60: return 0.41
    default: return ambientTemp > 60 ? 0.41 : 1.0
    }
}

private func conduitFillDerating(conductorCount: Int) -> Double {
    switch conductorCount {
    case 1...3: return 1.0
    case 4...6: return 0.80
    case 7...9: return 0.70
    case 10...20: return 0.50
    default: return 0.45
    }
}

private func nearestBreakerSize(_ amps: Double) -> Int {
    let breakers = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600, 800, 1000, 1200]
    return breakers.first { Double($0) >= amps } ?? breakers.last ?? amps > 1200 ? Int(amps) : 15
}

private func takeUp(conduitSize: String) -> Double {
    let table: [String: Double] = [
        "1/2": 5, "3/4": 5, "1": 6, "1-1/4": 7, "1-1/2": 8,
        "2": 9, "2-1/2": 12, "3": 14, "3-1/2": 16, "4": 18
    ]
    return table[conduitSize, default: 6]
}
