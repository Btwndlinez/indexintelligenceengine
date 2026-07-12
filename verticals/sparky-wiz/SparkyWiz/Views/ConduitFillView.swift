import SwiftUI

struct ConduitFillView: View {
    @State private var conduitType = "EMT"
    @State private var conduitSize = "3/4"

    @State private var wires: [WireEntry] = [
        WireEntry(size: "#12", quantity: 4),
        WireEntry(size: "#10", quantity: 1)
    ]

    @State private var result: ConduitFillResult?
    @State private var showError = false
    @State private var errorMessage = ""

    let conduitTypes = ["EMT", "RMC"]
    let conduitSizes = ["1/2", "3/4", "1"]
    let wireSizes = ["#14", "#12", "#10", "#8", "#6"]

    var body: some View {
        NavigationView {
            Form {
                Section("Conduit Type & Size") {
                    Picker("Type", selection: $conduitType) {
                        ForEach(conduitTypes, id: \.self) { Text($0) }
                    }
                    .pickerStyle(.segmented)

                    Picker("Trade Size", selection: $conduitSize) {
                        ForEach(conduitSizes, id: \.self) { Text("\($0) in") }
                    }
                }

                Section("Wires (THHN/THWN)") {
                    ForEach(wires.indices, id: \.self) { index in
                        HStack {
                            Picker("Size", selection: $wires[index].size) {
                                ForEach(wireSizes, id: \.self) { Text($0) }
                            }

                            Stepper("Qty: \(wires[index].quantity)", value: $wires[index].quantity, in: 1...50)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .onDelete(perform: removeWire)

                    Button("Add Wire") {
                        wires.append(WireEntry(size: "#12", quantity: 1))
                    }
                }

                Section {
                    Button(action: runCalculation) {
                        Text("CALCULATE FILL")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                    .listRowInsets(EdgeInsets())
                }

                if let r = result {
                    Section("Results") {
                        HStack {
                            Text("Total Wire Area")
                            Spacer()
                            Text(String(format: "%.4f sq in", r.totalWireArea))
                                .bold()
                        }
                        HStack {
                            Text("Max Allowed Area")
                            Spacer()
                            Text(String(format: "%.4f sq in (%d%%)", r.maxAllowedArea, Int(r.maxFillPercentage * 100)))
                                .bold()
                        }
                        HStack {
                            Text("Fill Percentage")
                            Spacer()
                            Text(String(format: "%.1f%%", r.fillPercentage * 100))
                                .bold()
                                .foregroundColor(r.isCompliant ? .green : .red)
                        }

                        Text(r.isCompliant ? "✅ COMPLIANT" : "❌ OVER FILL LIMIT")
                            .font(.title2)
                            .bold()
                            .frame(maxWidth: .infinity)
                            .foregroundColor(r.isCompliant ? .green : .red)
                    }
                }
            }
            .navigationTitle("Conduit Fill")
            .alert("Calculation Error", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
        }
    }

    private func removeWire(at offsets: IndexSet) {
        wires.remove(atOffsets: offsets)
    }

    private func runCalculation() {
        guard let conduitProp = try? DatabaseManager.shared.fetchConduitProperty(type: conduitType, size: conduitSize) else {
            errorMessage = "Conduit data not found for \(conduitType) \(conduitSize)."
            showError = true
            return
        }

        var wireAreas: [String: Double] = [:]
        for wire in wires {
            if wireAreas[wire.size] == nil {
                guard let wireProp = try? DatabaseManager.shared.fetchWireProperty(size: wire.size, material: "Copper") else {
                    errorMessage = "Wire data not found for \(wire.size) Copper THHN."
                    showError = true
                    return
                }
                wireAreas[wire.size] = wireProp.thhnAreaSqIn
            }
        }

        let input = ConduitFillInput(conduitType: conduitType, conduitSize: conduitSize, wires: wires)
        let calcResult = CalculatorEngine.calculateConduitFill(
            input: input,
            wireAreas: wireAreas,
            conduitArea: conduitProp.internalAreaSqIn
        )

        result = calcResult
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(calcResult.isCompliant ? .success : .error)

        DispatchQueue.global(qos: .utility).async {
            try? DatabaseManager.shared.saveCalculation(type: "ConduitFill", input: input, result: calcResult)
        }
    }
}
