<?php
$result_found_msg = isset( $elem['resultFound'] ) ? sanitize_text_field( $elem['resultFound'] ) : '';
$single_page_msg = isset( $elem['singlePageResult'] ) ? sanitize_text_field( $elem['singlePageResult'] ) : '';
$single_result_msg = isset( $elem['singleResult'] ) ? sanitize_text_field( $elem['singleResult'] ) : '';
$no_result_msg = isset( $elem['noResult'] ) ? sanitize_text_field( $elem['noResult'] ) : '';
$total_result_count = (int) $products_query->found_posts;
$total_no_pages = (int) $products_query->max_num_pages;
$first_result_count = ( $products_query->query_vars['posts_per_page'] * $paged ) - ( $products_query->query_vars['posts_per_page'] - 1 );

if( ( $products_query->query_vars['posts_per_page'] * $paged ) <= $total_result_count ) {
    $last_result_count = (int) ( $products_query->query_vars['posts_per_page'] * $paged );
} else {
    $last_result_count = $total_result_count;
}

$result_count = '<div class="awcpt-result-count">';
$result_count .= '<span class="awcpt-result-msg">';

if( $total_result_count === 1 ) {
    $result_count .= esc_html__( $single_result_msg, 'product-table-for-woocommerce' );
} elseif( $total_no_pages === 1 && $total_result_count !== 1 ) {
    $single_page_msg = str_replace( '{totalResults}', esc_html( $total_result_count ), $single_page_msg );
    $result_count .= esc_html__( $single_page_msg, 'product-table-for-woocommerce' );
} elseif( $total_result_count <= 0 ) {
    $result_count .= esc_html__( $no_result_msg, 'product-table-for-woocommerce' );
} else {
    // adjusting last result count for load more case
    if( ! $pagination_status ) {
        $last_result_count = (int) $offset;
    }

    $result_found_msg = str_replace( '{firstResult}', esc_html( $first_result_count ), $result_found_msg );
    $result_found_msg = str_replace( '{lastResult}', esc_html( $last_result_count ), $result_found_msg );
    $result_found_msg = str_replace( '{totalResults}', esc_html( $total_result_count ), $result_found_msg );
    $result_count .= esc_html__( $result_found_msg, 'product-table-for-woocommerce' );
}

$result_count .= '</span>';
$result_count .= '</div>';

echo $result_count;
