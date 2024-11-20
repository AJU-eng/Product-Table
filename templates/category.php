<?php
$product_id = absint( $prd_data['id'] );

// Sanitize separator and no categories message
$cat_separator = ! empty( $column['separator'] ) ? sanitize_text_field( $column['separator'] ) : ', ';
$cats_notfound_msg = ! empty( $column['nocatsMsg'] ) ? sanitize_text_field( $column['nocatsMsg'] ) : 'Categories not found!';

// Get the categories
$categories = get_the_terms( $product_id, 'product_cat' );
$cat_html = '<div class="awcpt-categories">';

if( $categories ){
    $i = 0;
    $categories_count = count( $categories );
    $cat_html .= '<p>';
    foreach( $categories as $category ){
        // Escape category name
        $cat_html .= esc_html( $category->name );
        if( $i < ( $categories_count - 1 ) ){
            $cat_html .= esc_html( $cat_separator );
        }
        $i++;
    }
    $cat_html .= '</p>';
} else {
    // Escape and output "no categories found" message
    $cat_html .= '<div class="awcpt-cats-notfound">'. wp_kses_post( __( $cats_notfound_msg, 'product-table-for-woocommerce' ) ) .'</div>';
}

$cat_html .= '</div>';

// Safely output the final HTML
echo wp_kses_post( $cat_html );
