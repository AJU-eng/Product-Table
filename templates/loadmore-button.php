<?php
if ( $products_query->found_posts <= $products_per_page ) {
    return;
}

// Sanitize the table ID to ensure it's a valid HTML attribute
$table_id = sanitize_key( $table_id );

// Sanitize the load more button text
$load_more_btn_txt = sanitize_text_field( $load_more_btn_txt );

// Prepare the load more button HTML
$loadmore_btn_html = '<div class="awcpt-loadmore-btn-wrapper">';
$loadmore_btn_html .= '<a href="#" class="awcpt-button awcpt-loadmore-btn awcpt-loadmore-btn-' . esc_attr( $table_id ) . '" data-offset="' . esc_attr( $products_per_page ) . '">';
$loadmore_btn_html .= esc_html( $load_more_btn_txt ); // Escape the button text
$loadmore_btn_html .= '</a>';
$loadmore_btn_html .= '</div>';

echo $loadmore_btn_html;
