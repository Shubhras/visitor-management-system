import 'package:flutter/material.dart';

class Dimensions {

  static double getFontSize(BuildContext context, double mobile, double web) {
    final width = MediaQuery.of(context).size.width;
    return width >= 1300 ? web : mobile;
  }

  /// ---------------- FONT SIZES ----------------

  static double fontSizeOverSmall(BuildContext context) =>
      getFontSize(context, 8, 10);

  static double fontSizeExtraSmall(BuildContext context) =>
      getFontSize(context, 10, 12);

  static double fontSizeSmall(BuildContext context) =>
      getFontSize(context, 12, 14);

  static double fontSizeDefault(BuildContext context) =>
      getFontSize(context, 14, 16);

  static double fontSizeLarge(BuildContext context) =>
      getFontSize(context, 16, 18);

  static double fontSizeExtraLarge(BuildContext context) =>
      getFontSize(context, 18, 20);

  static double fontSizeOverLarge(BuildContext context) =>
      getFontSize(context, 24, 26);

  /// ---------------- PADDING ----------------

  static const double paddingSizeExtraSmall = 5;
  static const double paddingSizeSmall = 10;
  static const double paddingSizeDefault = 15;
  static const double paddingSizeLarge = 20;
  static const double paddingSizeExtraLarge = 25;
  static const double paddingSizeExtremeLarge = 30;
  static const double paddingSizeExtraOverLarge = 35;

  /// ---------------- RADIUS ----------------

  static const double radiusSmall = 5;
  static const double radiusMedium = 8;
  static const double radiusDefault = 10;
  static const double radiusLarge = 15;
  static const double radiusExtraLarge = 20;

  /// ---------------- HEIGHTS ----------------

  static const double buttonHeight = 50;
  static const double inputHeight = 55;
  static const double appBarHeight = 56;
  static const double drawerHeaderHeight = 200;
  static const double visitorCardHeight = 120;

  /// ---------------- WIDTHS ----------------

  static const double buttonWidth = double.infinity;
  static const double maxContentWidth = 600;

  /// ---------------- ICON SIZES ----------------

  static const double iconSmall = 16;
  static const double iconMedium = 22;
  static const double iconLarge = 28;

  /// ---------------- AVATAR ----------------

  static const double avatarRadiusSmall = 20;
  static const double avatarRadiusMedium = 28;
  static const double avatarRadiusLarge = 40;

  /// ---------------- LOGO ----------------

  static const double logoSmall = 40;
  static const double logoMedium = 70;
  static const double logoLarge = 120;

  /// ---------------- LAYOUT ----------------

  static const double webMaxWidth = 1170;
  static const int messageInputLength = 1000;

  /// ---------------- MAP ----------------

  static const double pickMapIconSize = 100;
}