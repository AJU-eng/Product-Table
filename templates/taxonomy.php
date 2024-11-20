<?php
$product_id = $prd_data['id'];

// Sanitize and check if the taxonomy slug is present
$taxonomy = ! empty( $column['taxSlug'] ) ? sanitize_text_field( $column['taxSlug'] ) : null;
if( empty( $taxonomy ) ){
    return;
}

// Sanitize the separator and the "terms not found" message
$terms_separator = ! empty( $column['separator'] ) ? sanitize_text_field( $column['separator'] ) : ', ';
$terms_notfound_msg = ! empty( $column['noTermsMsg'] ) ? sanitize_text_field( $column['noTermsMsg'] ) : 'Terms not found!';

// Get terms and construct the HTML safely
$terms = get_the_terms( $product_id, $taxonomy );
$terms_html = '<div class="awcpt-tax-terms">';

if( $terms ){
    $i = 0;
    $terms_count = count( $terms );
    $terms_html .= '<p>';
    foreach( $terms as $term ){
        $terms_html .= esc_html( $term->name );
        if( $i < ( $terms_count - 1 ) ){
            $terms_html .= esc_html( $terms_separator );
        }
        $i++;
    }
    $terms_html .= '</p>';
} else {
    $terms_html .= '<div class="awcpt-terms-notfound">' . esc_html__( $terms_notfound_msg, 'product-table-for-woocommerce' ) . '</div>';
}

$terms_html .= '</div>';

echo $terms_html;
