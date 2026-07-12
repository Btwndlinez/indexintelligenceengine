import SwiftUI

struct VoltageDropView: View {
    @State private var voltage: String = "240"
    @State private var amperage: String = "30"
    @State private var length: String = "150"
    @State private var phase: Int = 1
    @State private var material: String = "Copper"
    @State private var wireSize: String = "#10"

    @State private var result: VoltageDropResult?
    @State private var showError = false
    @State private var errorMessage = ""

    let wireSizes = ["#14", "#12", "#10", "#8", "#6"]

    var body: some View {
        NavigationView {
            Form {
                Section("Wire Properties") {
                    Picker("Material", selection: $material) {
                        Text("Copper").tag("Copper")
                        Text("Aluminum").tag("Aluminum")
                    }
                    .pickerStyle(.segmented)

                    Picker("Wire Size", selection: $wireSize) {
                        ForEach(wireSizes, id: \.self) { size in
                            Text(size).tag(size)
                        }
                    }
                }

                Section("Circuit Parameters") {
                    TextField("Source Voltage (V)", text: $voltage)
                        .keyboardType(.decimalPad)
                    TextField("Amperage (A)", text: $amperage)
                        .keyboardType(.decimalPad)
                    TextField("One-way Length (ft)", text: $length)
                        .keyboardType(.decimalPad)

                    Picker("Phase", selection: $phase) {
                        Text("1-Phase").tag(1)
                        Text("3-Phase").tag(3)
                    }
                    .pickerStyle(.segmented)
                }

                Section {
                    Button(action: calculate) {
                        Text("CALCULATE")
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
                        ResultRow(label: "Voltage Drop", value: "\(r.voltageDrop, specifier: "%.2f") V")
                        ResultRow(label: "Voltage at End", value: "\(r.voltageAtEnd, specifier: "%.2f") V")
                        ResultRow(label: "Drop %", value: "\(r.dropPercentage, specifier: "%.2f")%",
                                  color: r.meetsNEC ? .green : .red)
                        HStack {
                            Image(systemName: r.meetsNEC ? "checkmark.circle.fill" : "exclamationmark.circle.fill")
                                .foregroundColor(r.meetsNEC ? .green : .red)
                            Text(r.meetsNEC ? "Meets NEC 3% recommendation" : "Exceeds 3% — consider larger wire")
                                .font(.caption)
                        }
                    }
                }
            }
            .navigationTitle("Voltage Drop")
            .alert("Calculation Error", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
        }
    }

    private func calculate() {
        guard let v = Double(voltage), let a = Double(amperage), let l = Double(length), l > 0 else {
            errorMessage = "Please enter valid numbers for Voltage, Amperage, and Length."
            showError = true
            return
        }

        guard let wireProperty = try? DatabaseManager.shared.fetchWireProperty(size: wireSize, material: material) else {
            errorMessage = "Could not find NEC data for \(wireSize) \(material). Check local database."
            showError = true
            return
        }

        let input = VoltageDropInput(
            voltage: v,
            amperage: a,
            oneWayLength: l,
            phase: phase,
            resistancePerKFT: wireProperty.resistancePerKFT
        )

        let calcResult = CalculatorEngine.voltageDrop(input: input)
        result = calcResult

        let generator = UIImpactFeedbackGenerator(style: .heavy)
        generator.impactOccurred()

        DispatchQueue.global(qos: .utility).async {
            do {
                try DatabaseManager.shared.saveCalculation(type: "VoltageDrop", input: input, result: calcResult)
            } catch {
                print("Save failed: \(error)")
            }
        }
    }
}

struct ResultRow: View {
    let label: String
    let value: String
    var color: Color = .primary

    var body: some View {
        HStack {
            Text(label)
            Spacer()
            Text(value)
                .bold()
                .foregroundColor(color)
        }
    }
}
