import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_event.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_state.dart';
import 'package:visitor_management/features/auth/presentation/screens/login_screen.dart';
import 'package:visitor_management/features/visitor/presentation/screens/visitor_list_screen.dart';
import 'package:visitor_management/shared/widgets/app_drawer.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();

  int index = 0;

  /// Drawer Actions
  void handleDrawer(String page) {
    if (page == "visitors") {
      Navigator.pop(context);
      setState(() => index = 0);
    }

    if (page == "profile") {
      Navigator.pop(context);
      setState(() => index = 1);
    }

    if (page == "logout") {
      showLogoutDialog(); // drawer open rahega
    }
  }

  /// Logout Popup
  void showLogoutDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Logout"),
        content: const Text("Are you sure you want to logout?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),

          ElevatedButton(
            onPressed: () {
              Navigator.pop(context); // close dialog
              Navigator.pop(context); // close drawer

              context.read<AuthBloc>().add(LogoutRequested());
            },
            child: const Text("OK"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthLoggedOut) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (_) => const LoginScreen()),
            (route) => false,
          );
        }
        if (state is AuthFailure) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.message)));
        }
      },

      child: AnnotatedRegion<SystemUiOverlayStyle>(
        value: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
        ),

        child: Scaffold(
          key: scaffoldKey,

          drawer: AppDrawer(
            currentPage: index == 0 ? "visitors" : "profile",
            onSelect: handleDrawer,
          ),

          body: IndexedStack(
            index: index,
            children: [
              VisitorListScreen(
                openDrawer: () => scaffoldKey.currentState?.openDrawer(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
