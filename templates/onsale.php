<?php
if( $product->is_on_sale() ) {
    // Sanitize regular and sale prices
    $regular_price = floatval( $prd_data['regular_price'] ); // Ensure it's a float
    $sale_price = floatval( $prd_data['sale_price'] ); // Ensure it's a float

    if( isset( $sale_price ) && $sale_price > 0 && $regular_price > $sale_price ) {
        $onsale_template = sanitize_text_field( $column['template'] ); // Sanitize the template
        
        // Calculate price off and percentage off
        $price_off = $regular_price - $sale_price;
        $percentage_off = round( ( $price_off / $regular_price ) * 100 );
        $price_off_formatted = wc_price( $price_off ); // Format the price for display

        // Replace placeholders in the template
        if( strpos( $onsale_template, '{PriceOff}' ) !== false ) {
            $onsale_template = str_replace( '{PriceOff}', $price_off_formatted, $onsale_template );
        }

        if( strpos( $onsale_template, '{PercentOff}' ) !== false ) {
            $onsale_template = str_replace( '{PercentOff}', intval($percentage_off), $onsale_template ); // Ensure it's an integer
        }

        // Prepare and output the onsale HTML
        $onsale_html = '<div class="awcpt-onsale-wrap">';
        $onsale_html .= $onsale_template;
        $onsale_html .= '</div>';

        echo $onsale_html; // Output the sanitized HTML
    } else {
        return;
    }
} else {
    return;
}
