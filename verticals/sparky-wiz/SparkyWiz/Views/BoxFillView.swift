import SwiftUI

struct BoxFillView: View {
    @State private var boxType = "Square"
    @State private var boxSize = "4x4x2.125"
    @State private var conductorCount: String = "4"
    @State private var clampCount: String = "0"
    @State private var supportFittings: String = "0"
    @State private var deviceCount: String = "1"
    @State private var equipmentGrounds: String = "1"

    @State private var result: BoxFillResult?
    @State private var showError = false

    var body: some View {
        ProGateView(feature: "Box Fill") {
            Form {
                Section("Box") {
                    Picker("Type", selection: $boxType) {
                        Text("Square").tag("Square")
                        Text("Round").tag("Round")
                        Text("Device").tag("Device")
                    }
                    Picker("Size", selection: $boxSize) {
                        Text("4\" x 4\" x 2.125\"").tag("4x4x2.125")
                        Text("4\" x 4\" x 1.5\"").tag("4x4x1.5")
                        Text("4-11/16\" x 2.125\"").tag("4-11/16x2.125")
                        Text("3\" x 2\" x 2.5\"").tag("3x2x2.5")
                        Text("3\" x 2\" x 3\"").tag("3x2x3")
                        Text("1-Gang Device").tag("onegang")
                        Text("2-Gang Device").tag("twogang")
                    }
                }

                Section("Fill Items") {
                    HStack { Text("Conductors"); Spacer(); TextField("", text: $conductorCount).keyboardType(.numberPad).frame(width: 60) }
                    HStack { Text("Clamps"); Spacer(); TextField("", text: $clampCount).keyboardType(.numberPad).frame(width: 60) }
                    HStack { Text("Support Fittings"); Spacer(); TextField("", text: $supportFittings).keyboardType(.numberPad).frame(width: 60) }
                    HStack { Text("Devices"); Spacer(); TextField("", text: $deviceCount).keyboardType(.numberPad).frame(width: 60) }
                    HStack { Text("Equipment Grounds"); Spacer(); TextField("", text: $equipmentGrounds).keyboardType(.numberPad).frame(width: 60) }
                }

                Section {
                    Button(action: calculate) {
                        Text("CALCULATE").font(.headline).frame(maxWidth: .infinity).padding()
                            .background(Color.blue).foregroundColor(.white).cornerRadius(12)
                    }.listRowInsets(EdgeInsets())
                }

                if let r = result {
                    Section("Results") {
                        ResultRow(label: "Volume Allowance", value: "\(r.totalVolumeAllowance, specifier: "%.1f") cu in")
                        ResultRow(label: "Available Volume", value: "\(r.availableVolume, specifier: "%.1f") cu in")
                        ResultRow(label: "Remaining", value: "\(r.remainingVolume, specifier: "%.1f") cu in",
                                  color: r.isOverfilled ? .red : .green)
                        if r.isOverfilled {
                            Label("Box is overfilled — use larger box", systemImage: "exclamationmark.triangle.fill")
                                .foregroundColor(.red).font(.caption)
                        }
                    }
                }
            }
            .navigationTitle("Box Fill")
            .alert("Invalid Input", isPresented: $showError) { Button("OK", role: .cancel) {} }
        }
    }

    private func calculate() {
        guard let cond = Int(conductorCount), let clamp = Int(clampCount),
              let support = Int(supportFittings), let device = Int(deviceCount),
              let egc = Int(equipmentGrounds) else {
            showError = true; return
        }
        let input = BoxFillInput(boxType: boxType, boxSize: boxSize, conductorCount: cond,
                                 clampCount: clamp, supportFittings: support,
                                 deviceCount: device, equipmentGrounds: egc)
        result = CalculatorEngine.boxFill(input: input)
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        DispatchQueue.global(qos: .utility).async {
            try? DatabaseManager.shared.saveCalculation(type: "BoxFill", input: input, result: result!)
        }
    }
}
