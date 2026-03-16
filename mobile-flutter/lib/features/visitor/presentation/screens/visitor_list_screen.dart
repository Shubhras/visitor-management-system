import 'package:flutter/material.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/shared/widgets/app_bar_widget.dart';

class VisitorListScreen extends StatefulWidget {
  final VoidCallback openDrawer;

  const VisitorListScreen({super.key, required this.openDrawer});

  @override
  State<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends State<VisitorListScreen> {
  String currentPage = "visitors";

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      /// AppBar
      appBar: AppBarWidget(
        title: "Visitors List",
        onMenuTap: widget.openDrawer,
      ),

      /// Add visitor button

      /// Visitor list
      body: Text("Welcome Visitore List"),
    );
  }
}
