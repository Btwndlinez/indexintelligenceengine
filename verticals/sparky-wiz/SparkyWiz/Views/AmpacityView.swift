import SwiftUI

struct AmpacityView: View {
    @State private var wireSize = "#12"
    @State private var insulationType = "THHN"
    @State private var temperatureRating = 90
    @State private var ambientTemp: String = "30"
    @State private var conduitFillCount: String = "3"
    @State private var isUnderground = false

    @State private var result: AmpacityResult?
    @State private var showError = false

    var body: some View {
        ProGateView(feature: "Ampacity") {
            Form {
                Section("Conductor") {
                    Picker("Wire Size", selection: $wireSize) {
                        ForEach(["#14", "#12", "#10", "#8", "#6", "#4", "#3", "#2", "#1", "1/0", "2/0", "3/0", "4/0"], id: \.self) { s in
                            Text(s).tag(s)
                        }
                    }
                    Picker("Insulation", selection: $insulationType) {
                        Text("THHN/THWN (90°C)").tag("THHN")
                        Text("THW (75°C)").tag("THW")
                        Text("XHHW (90°C)").tag("XHHW")
                    }
                }

                Section("Conditions") {
                    Picker("Temp Rating", selection: $temperatureRating) {
                        Text("60°C").tag(60)
                        Text("75°C").tag(75)
                        Text("90°C").tag(90)
                    }
                    HStack {
                        Text("Ambient Temp (°C)")
                        Spacer()
                        TextField("30", text: $ambientTemp).keyboardType(.decimalPad).frame(width: 60)
                    }
                    HStack {
                        Text("Conductors in Conduit")
                        Spacer()
                        TextField("3", text: $conduitFillCount).keyboardType(.numberPad).frame(width: 60)
                    }
                }

                Section {
                    Button(action: calculate) {
                        Text("CALCULATE").font(.headline).frame(maxWidth: .infinity).padding()
                            .background(Color.blue).foregroundColor(.white).cornerRadius(12)
                    }.listRowInsets(EdgeInsets())
                }

                if let r = result {
                    Section("Results") {
                        ResultRow(label: "Base Ampacity", value: "\(r.baseAmpacity, specifier: "%.0f") A")
                        ResultRow(label: "Temp Derating", value: "\(r.tempDeratingFactor, specifier: "%.0f")%")
                        ResultRow(label: "Fill Derating", value: "\(r.conduitFillDeratingFactor, specifier: "%.0f")%")
                        ResultRow(label: "Adjusted Ampacity", value: "\(r.adjustedAmpacity, specifier: "%.0f") A", color: .blue)
                        ResultRow(label: "Recommended Breaker", value: "\(r.recommendedBreakerSize) A", color: .green)
                    }
                }
            }
            .navigationTitle("Ampacity")
            .alert("Invalid Input", isPresented: $showError) { Button("OK", role: .cancel) {} }
        }
    }

    private func calculate() {
        guard let temp = Double(ambientTemp), let fill = Int(conduitFillCount), fill > 0 else {
            showError = true; return
        }
        let input = AmpacityInput(wireSize: wireSize, insulationType: insulationType,
                                  temperatureRating: temperatureRating, ambientTemp: temp,
                                  conduitFillCount: fill, isUnderground: isUnderground)
        result = CalculatorEngine.ampacity(input: input)
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        DispatchQueue.global(qos: .utility).async {
            try? DatabaseManager.shared.saveCalculation(type: "Ampacity", input: input, result: result!)
        }
    }
}
