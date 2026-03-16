import 'package:flutter/material.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';

class AppDrawer extends StatelessWidget {
  final String currentPage;
  final Function(String) onSelect;

  const AppDrawer({
    super.key,
    required this.currentPage,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          /// HEADER
          Container(
            width: double.infinity,
            constraints: const BoxConstraints(
              minHeight: Dimensions.drawerHeaderHeight, // maintain layout
            ),
            padding: const EdgeInsets.fromLTRB(
              Dimensions.paddingSizeLarge,
              Dimensions.appBarHeight,
              Dimensions.paddingSizeLarge,
              Dimensions.paddingSizeLarge,
            ),

            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.primary, AppColors.secondary],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),

            child: Stack(
              clipBehavior: Clip.none,
              children: [
                /// USER INFO
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: Dimensions.iconLarge,
                      backgroundColor: Colors.white,
                      child: const Icon(Icons.person, color: AppColors.primary),
                    ),

                    const SizedBox(height: Dimensions.paddingSizeSmall),

                    Text(
                      "Digiprima Technologies",
                      style: TextStyle(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.bold,
                        fontSize: Dimensions.fontSizeExtraLarge(context),
                      ),
                    ),

                    // const SizedBox(height: Dimensions.paddingSizeExtraSmall),
                    Text(
                      "digiprima@gmail.com",
                      style: TextStyle(
                        color: AppColors.textLight.withValues(alpha: 0.85),
                        fontSize: Dimensions.fontSizeSmall(context),
                      ),
                    ),
                  ],
                ),

                /// BACKGROUND LOGO
                Positioned(
                  right: -Dimensions.paddingSizeSmall,
                  bottom: -Dimensions.paddingSizeLarge,
                  child: Opacity(
                    opacity: 0.30,
                    child: Image.asset(
                      "assets/images/genio360_logo_white-removebg-preview.png",
                      height: Dimensions.paddingSizeExtraOverLarge * 2,
                    ),
                  ),
                ),
              ],
            ),
          ),

          /// VISITORS MENU
          ListTile(
            leading: Icon(
              Icons.home,
              color: currentPage == "visitors"
                  ? AppColors.primary
                  : AppColors.textSecondary,
            ),
            title: Text(
              "Visitors",
              style: TextStyle(
                fontWeight: currentPage == "visitors"
                    ? FontWeight.bold
                    : FontWeight.normal,
                color: currentPage == "visitors"
                    ? AppColors.primary
                    : AppColors.textPrimary,
                fontSize: Dimensions.fontSizeDefault(context),
              ),
            ),
            onTap: () => onSelect("visitors"),
          ),

          const Spacer(),

          /// LOGOUT
          ListTile(
            leading: const Icon(Icons.logout, color: AppColors.error),
            title: Text(
              "Logout",
              style: TextStyle(
                fontSize: Dimensions.fontSizeDefault(context),
                color: AppColors.textPrimary,
              ),
            ),
            onTap: () => onSelect("logout"),
          ),

          const SizedBox(height: Dimensions.paddingSizeLarge),
        ],
      ),
    );
  }
}
