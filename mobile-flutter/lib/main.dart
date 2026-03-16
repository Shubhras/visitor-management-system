import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:visitor_management/core/navigation/app_startup.dart';
import 'package:visitor_management/core/services/api_service.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_bloc.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: ".env");

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final ApiService apiService = ApiService();

    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (_) => AuthBloc(apiService),
        ),
       
      ],

      child: MaterialApp(
        debugShowCheckedModeBanner: false, // remove debug banner
        title: "Genio360 Visitor Management",

        theme: ThemeData(
          useMaterial3: true,
        ),

        home: const AppStartup(),
      ),
    );
  }
}
