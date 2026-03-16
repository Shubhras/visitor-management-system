import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_bloc.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_event.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_state.dart';
import 'package:visitor_management/shared/widgets/app_bar_widget.dart';
import 'package:visitor_management/shared/widgets/error_widget.dart';
import 'package:visitor_management/shared/widgets/shimmer_loading.dart';
import 'package:visitor_management/shared/widgets/visitor_card.dart';

class VisitorListScreen extends StatefulWidget {
  final VoidCallback openDrawer;

  const VisitorListScreen({super.key, required this.openDrawer});

  @override
  State<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends State<VisitorListScreen> {
  final ScrollController _scrollController = ScrollController();
  String currentPage = "visitors";

  @override
  void initState() {
    super.initState();

    context.read<VisitorBloc>().add(FetchVisitors());

    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        context.read<VisitorBloc>().add(LoadMoreVisitors());
      }
    });
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
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,

        onPressed: () {
          print("Visitor Create Screen");
        },

        child: const Icon(Icons.add, color: AppColors.textLight),
      ),

      /// Visitor list
      body: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: Dimensions.paddingSizeDefault,
        ),

        child: BlocListener<VisitorBloc, VisitorState>(
          listener: (context, state) {
            if (state is VisitorError) {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text(state.message)));
            }
          },

          child: BlocBuilder<VisitorBloc, VisitorState>(
            builder: (context, state) {
              if (state is VisitorLoading) {
                return const ShimmerLoading();
              }

              if (state is VisitorError) {
                return CustomErrorWidget(message: state.message);
              }

              if (state is VisitorLoaded) {
                if (state.visitors.isEmpty) {
                  return Center(
                    child: Text(
                      "No Visitors Found",
                      style: TextStyle(
                        fontSize: Dimensions.fontSizeDefault(context),
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(
                    vertical: Dimensions.paddingSizeSmall,
                  ),
                  itemCount: state.visitors.length,
                  itemBuilder: (context, index) {
                    final visitor = state.visitors[index];

                    return VisitorCard(visitor: visitor);
                  },
                );
              }

              return const SizedBox();
            },
          ),
        ),
      ),
    );
  }
}
