<?php 

$out_stock_msg = esc_html($column['outStockMsg']);
$single_stock_msg = esc_html($column['singleStockMsg']);
if( $column['stockThreshold'] && $column['stockThreshold'] >= 0 ){
    $low_stock_threshold = esc_html($column['stockThreshold']);
} else {
    $low_stock_threshold = esc_html($prd_data['low_stock_amount']);
}
$low_stock_msg = esc_html($column['lowStockMsg']);
$in_stock_msg = esc_html($column['inStockMsg']);
$manage_stock = esc_html($prd_data['manage_stock']);
$stock_status = esc_html($prd_data['stock_status']);

$availability_html = '<div class="awcpt-stock-availability">';
if( $manage_stock ){
    $stock_quantity = esc_html($prd_data['stock_quantity']);
    if( $stock_status == 'outofstock' ){
        $availability_html .= '<p>' . esc_html($out_stock_msg) . '</p>';
    } elseif( $stock_status == 'instock' ) {
        if( $stock_quantity == 1 ){
            $single_stock_msg = str_replace( '{stock}', esc_html($stock_quantity), $single_stock_msg );
            $availability_html .= '<p>' . esc_html($single_stock_msg) . '</p>';
        } elseif( $stock_quantity <= $low_stock_threshold ) {
            $low_stock_msg = str_replace( '{stock}', esc_html($stock_quantity), $low_stock_msg );
            $availability_html .= '<p>' . esc_html($low_stock_msg) . '</p>';
        } else {
            $in_stock_msg = str_replace( '{stock}', esc_html($stock_quantity), $in_stock_msg );
            $availability_html .= '<p>' . esc_html($in_stock_msg) . '</p>';
        }
    } else {
        $availability_html .= '<p>' . esc_html($stock_status) . '</p>';
    }
} else {
    if( $stock_status == 'outofstock' ){
        $availability_html .= '<p>' . esc_html($out_stock_msg) . '</p>';
    } else {
        $availability_html .= '<p>' . esc_html($stock_status) . '</p>';
    }
}
$availability_html .= '</div>';

echo wp_kses_post($availability_html);
