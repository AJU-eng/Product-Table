<?php
if( ! empty( $prd_data['weight'] ) ) { // Check if weight is set
    $weight_html = '<div class="awcpt-weight">';
    $weight_html .= esc_html( $prd_data['weight'] ) . esc_html( get_option( 'woocommerce_weight_unit' ) ); // Sanitize weight and unit
    $weight_html .= '</div>';

    echo $weight_html;
} else {
    return;
}
