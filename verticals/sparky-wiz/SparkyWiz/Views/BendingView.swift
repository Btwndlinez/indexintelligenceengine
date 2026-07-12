import SwiftUI

struct BendingView: View {
    @State private var conduitType = "EMT"
    @State private var conduitSize = "1/2"
    @State private var bendAngle: Double = 30
    @State private var calculationMode = 0
    @State private var stubLength: String = "12"
    @State private var offsetHeight: String = "4"

    @State private var result: BendingResult?
    @State private var showError = false

    var body: some View {
        ProGateView(feature: "Bending") {
            Form {
                Section("Conduit") {
                    Picker("Type", selection: $conduitType) {
                        Text("EMT").tag("EMT")
                        Text("RMC").tag("RMC")
                    }
                    Picker("Size", selection: $conduitSize) {
                        ForEach(["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"], id: \.self) { s in
                            Text(s).tag(s)
                        }
                    }
                }

                Section("Bend Type") {
                    Picker("Mode", selection: $calculationMode) {
                        Text("Stub Up").tag(0)
                        Text("Offset").tag(1)
                    }
                    .pickerStyle(.segmented)

                    if calculationMode == 0 {
                        HStack {
                            Text("Stub Length (in)")
                            Spacer()
                            TextField("12", text: $stubLength).keyboardType(.decimalPad).frame(width: 60)
                        }
                    } else {
                        HStack {
                            Text("Offset Height (in)")
                            Spacer()
                            TextField("4", text: $offsetHeight).keyboardType(.decimalPad).frame(width: 60)
                        }
                    }

                    Picker("Bend Angle", selection: $bendAngle) {
                        Text("30°").tag(30.0)
                        Text("45°").tag(45.0)
                        Text("60°").tag(60.0)
                    }
                    .pickerStyle(.segmented)
                }

                Section {
                    Button(action: calculate) {
                        Text("CALCULATE").font(.headline).frame(maxWidth: .infinity).padding()
                            .background(Color.blue).foregroundColor(.white).cornerRadius(12)
                    }.listRowInsets(EdgeInsets())
                }

                if let r = result {
                    Section("Results") {
                        ResultRow(label: "Take-Up", value: "\(r.takeUp, specifier: "%.1f") in")
                        if calculationMode == 0 {
                            ResultRow(label: "Bend Mark", value: "\(r.bendMark, specifier: "%.1f") in", color: .blue)
                        } else {
                            ResultRow(label: "Shrink", value: "\(r.shrink, specifier: "%.2f") in")
                            ResultRow(label: "Total Length", value: "\(r.totalLength, specifier: "%.1f") in", color: .blue)
                        }
                    }
                }
            }
            .navigationTitle("Bending")
            .alert("Invalid Input", isPresented: $showError) { Button("OK", role: .cancel) {} }
        }
    }

    private func calculate() {
        let stub = calculationMode == 0 ? Double(stubLength) : nil
        let offset = calculationMode == 1 ? Double(offsetHeight) : nil

        guard stub != nil || offset != nil else {
            showError = true; return
        }

        let input = BendingInput(conduitType: conduitType, conduitSize: conduitSize,
                                 bendAngle: bendAngle, stubLength: stub, offsetHeight: offset)
        result = CalculatorEngine.bending(input: input)
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        DispatchQueue.global(qos: .utility).async {
            try? DatabaseManager.shared.saveCalculation(type: "Bending", input: input, result: result!)
        }
    }
}
