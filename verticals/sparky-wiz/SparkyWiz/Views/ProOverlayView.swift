import SwiftUI

struct ProGateView<Content: View>: View {
    let feature: String
    @ViewBuilder let content: Content

    @State private var showPaywall = false

    var body: some View {
        content
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showPaywall = true
                    } label: {
                        Image(systemName: "crown.fill")
                            .foregroundColor(.yellow)
                    }
                }
            }
            .sheet(isPresented: $showPaywall) {
                PaywallView(feature: feature)
            }
    }
}

struct PaywallView: View {
    let feature: String
    @Environment(\.dismiss) var dismiss

    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "crown.fill")
                .font(.system(size: 60))
                .foregroundColor(.yellow)
                .padding(.top, 60)

            Text("\(feature) is Pro")
                .font(.largeTitle.bold())

            Text("Upgrade to unlock all 5 calculators, unlimited saved jobs, cloud sync, PDF export, and more.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
                .padding(.horizontal)

            VStack(spacing: 12) {
                FeatureRow(icon: "bolt.fill", text: "All 5 Calculators")
                FeatureRow(icon: "icloud.fill", text: "iCloud Sync")
                FeatureRow(icon: "doc.fill", text: "PDF Export")
                FeatureRow(icon: "list.clipboard.fill", text: "Material Lists")
            }
            .padding(.vertical)

            Button(action: {
                // TODO: Integrate RevenueCat purchase
                print("Purchase Pro tapped")
            }) {
                Text("Upgrade to Pro — $9.99/mo")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .padding(.horizontal)

            Button("Maybe Later", role: .cancel) {
                dismiss()
            }

            Spacer()
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .frame(width: 24)
                .foregroundColor(.blue)
            Text(text)
            Spacer()
        }
        .padding(.horizontal)
    }
}
