import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load .env file BEFORE runApp
  await dotenv.load(fileName: ".env");

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Example: access BASE_URL anywhere in the app
    final baseUrl = dotenv.env['BASE_URL'] ?? 'http://fallback-url.com';

    print('BASE_URL from .env → $baseUrl'); // For debugging

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "Genio360 Visitor Management",
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(title: const Text("Welcome")),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text("Welcome to Genio360"),
              const SizedBox(height: 16),
              Text(
                "API Base URL: $baseUrl",
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }
}