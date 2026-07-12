import SwiftUI

@main
struct SparkyWizApp: App {
    init() {
        _ = DatabaseManager.shared
        _ = NetworkMonitor.shared
        _ = SyncManager.shared
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
        }
    }
}

struct ContentView: View {
    var body: some View {
        TabView {
            VoltageDropView()
                .tabItem {
                    Label("Voltage Drop", systemImage: "bolt.fill")
                }

            ConduitFillView()
                .tabItem {
                    Label("Conduit Fill", systemImage: "rectangle.split.2x2.fill")
                }

            MoreCalculatorsView()
                .tabItem {
                    Label("More", systemImage: "ellipsis.circle.fill")
                }
        }
    }
}

struct MoreCalculatorsView: View {
    var body: some View {
        NavigationView {
            List {
                NavigationLink("Box Fill") {
                    BoxFillView()
                }
                NavigationLink("Ampacity") {
                    AmpacityView()
                }
                NavigationLink("Bending") {
                    BendingView()
                }
            }
            .navigationTitle("More Calculators")
        }
    }
}
