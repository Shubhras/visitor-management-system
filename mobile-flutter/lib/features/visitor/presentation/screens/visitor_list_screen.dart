import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_bloc.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_event.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_state.dart';
import 'package:visitor_management/features/visitor/presentation/screens/create_visitor_screen.dart';
import 'package:visitor_management/shared/widgets/app_bar_widget.dart';
import 'package:visitor_management/shared/widgets/error_widget.dart';
import 'package:visitor_management/shared/widgets/shimmer_loading.dart';
import 'package:visitor_management/shared/widgets/visitor_card.dart';

/// VisitorListScreen
/// Displays list of visitors with pagination support.
/// Handles loading, error, and empty states using Bloc.

class VisitorListScreen extends StatefulWidget {
  final VoidCallback openDrawer;

  const VisitorListScreen({super.key, required this.openDrawer});

  @override
  State<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends State<VisitorListScreen> {
  /// Controller for detecting scroll position (used for pagination)
  final ScrollController _scrollController = ScrollController();

  /// Current page identifier (can be extended for tabs/navigation)
  String currentPage = "visitors";

  @override
  void initState() {
    super.initState();

    /// Initial API call to fetch visitors
    context.read<VisitorBloc>().add(FetchVisitors());

    /// Pagination listener
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        /// Trigger load more when reached bottom
        context.read<VisitorBloc>().add(LoadMoreVisitors());
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      /// Custom AppBar with drawer toggle
      appBar: AppBarWidget(
        title: "Visitors List",
        onMenuTap: widget.openDrawer,
      ),

      /// Floating action button to create new visitor
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateVisitorScreen()),
          );
        },
        child: const Icon(Icons.add, color: AppColors.textLight),
      ),

      /// Main body containing visitor list
      body: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: Dimensions.paddingSizeDefault,
        ),

        /// Listener for error handling
        child: BlocListener<VisitorBloc, VisitorState>(
          listener: (context, state) {
            if (state is VisitorError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message)),
              );
            }
          },

          /// Builder for UI rendering based on state
          child: BlocBuilder<VisitorBloc, VisitorState>(
            builder: (context, state) {
              /// Loading state with shimmer UI
              if (state is VisitorLoading) {
                return const ShimmerLoading();
              }

              /// Error state with retry UI
              if (state is VisitorError) {
                return CustomErrorWidget(message: state.message);
              }

              /// Success state
              if (state is VisitorLoaded) {
                /// Empty state UI
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

                /// Visitor list with pagination
                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(
                    vertical: Dimensions.paddingSizeSmall,
                  ),
                  itemCount: state.visitors.length,
                  itemBuilder: (context, index) {
                    final visitor = state.visitors[index];

                    /// Individual visitor card
                    return VisitorCard(visitor: visitor);
                  },
                );
              }

              /// Default fallback
              return const SizedBox();
            },
          ),
        ),
      ),
    );
  }
}