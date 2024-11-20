<?php
if ( get_option( 'woocommerce_enable_review_rating' ) === 'no' ) {
    return;
}

$template = isset( $column['template'] ) ? sanitize_key( $column['template'] ) : '';
$not_rated_msg = isset( $column['notRatedMsg'] ) ? sanitize_text_field( $column['notRatedMsg'] ) : '';
$avg_rating = isset( $prd_data['average_rating'] ) ? floatval( $prd_data['average_rating'] ) : 0;
$review_count = isset( $prd_data['review_count'] ) ? intval( $prd_data['review_count'] ) : 0;
$stars_width = ( $avg_rating / 5 ) * 100;

// Rating number HTML
$rating_num_html = '<div class="awcpt-average-rating">';
if ( $template === 'number_only' ) {
    $rating_num_html .= esc_html( $avg_rating ) . ' ' . esc_html__( 'out of 5 stars', 'product-table-for-woocommerce' );
} else {
    $rating_num_html .= esc_html( $avg_rating );
}
$rating_num_html .= '</div>';

// Review count HTML
$review_count_html = '<div class="awcpt-review-count">(' . esc_html( $review_count ) . ')</div>';

// Rating stars HTML
$stars_html = '<div class="awcpt-rating-stars star-rating">';
$stars_html .= '<span style="width:' . esc_attr( $stars_width ) . '%"></span>';
$stars_html .= '</div>';

// Rating template final output HTML
$rating_html = '<div class="awcpt-rating" title="' . esc_attr( $avg_rating ) . ' ' . esc_attr__( 'out of 5 stars', 'product-table-for-woocommerce' ) . '">';
if ( ! empty( $avg_rating ) || ( empty( $avg_rating ) && empty( $not_rated_msg ) ) ) {
    if ( $template === 'number_first' ) {
        $rating_html .= $rating_num_html . $stars_html . $review_count_html;
    } elseif ( $template === 'stars_first' ) {
        $rating_html .= $stars_html . $rating_num_html . $review_count_html;
    } elseif ( $template === 'count_first' ) {
        $rating_html .= $review_count_html . $stars_html . $rating_num_html;
    } elseif ( $template === 'count_middle' ) {
        $rating_html .= $rating_num_html . $review_count_html . $stars_html;
    } elseif ( $template === 'star_only' ) {
        $rating_html .= $stars_html;
    } elseif ( $template === 'no_number' ) {
        $rating_html .= $stars_html . $review_count_html;
    } elseif ( $template === 'no_count' ) {
        $rating_html .= $rating_num_html . $stars_html;
    } elseif ( $template === 'no_star' ) {
        $rating_html .= $rating_num_html . $review_count_html;
    } elseif ( $template === 'count_only' ) {
        $rating_html .= $review_count_html;
    } elseif ( $template === 'number_only' ) {
        $rating_html .= $rating_num_html;
    } else {
        $rating_html .= $rating_num_html;
    }
} else {
    if ( ! empty( $not_rated_msg ) ) {
        $rating_html .= esc_html__( $not_rated_msg, 'product-table-for-woocommerce' );
    }
}
$rating_html .= '</div>';

echo $rating_html;
