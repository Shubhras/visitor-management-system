import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:visitor_management/core/constants/app_colors.dart';

class AppBarWidget extends StatelessWidget implements PreferredSizeWidget {

  final String title;
  final VoidCallback? onMenuTap;

  const AppBarWidget({
    super.key,
    required this.title,
    this.onMenuTap,
  });

  @override
  Widget build(BuildContext context) {

    return AppBar(

      backgroundColor: AppColors.primary,

      elevation: 0,

      iconTheme: const IconThemeData(
        color: Colors.white,
      ),

      systemOverlayStyle: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
      ),

      leading: onMenuTap != null
          ? IconButton(
              icon: const Icon(Icons.menu, color: Colors.white),
              onPressed: onMenuTap,
            )
          : null,

      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),

      centerTitle: true,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}