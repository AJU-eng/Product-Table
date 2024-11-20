<?php
if ( $products_query->max_num_pages <= 1 ) {
    return;
}

// Prepare pagination arguments
$p_args = array(
    'format' => '?'. esc_attr( $table_id ) .'_paged=%#%', // Escape the table ID for safe use in URLs
    'type' => 'plain',
    'mid_size' => 3,
    'prev_next' => true,
    'current' => max( 1, intval( $current_page ) ), // Ensure current page is an integer
    'total' => intval( $products_query->max_num_pages ) // Ensure total pages is an integer
);

// Build pagination class with sanitization
$pagination_class = 'awcpt-pagination awcpt-pagination-' . esc_attr( $table_id ); // Escape the table ID
if( $ajax_pagination_status ){
    $pagination_class .= ' awcpt-ajax-pagination';
}

// Prepare and output the pagination HTML
$pagination_output = '<div class="' . esc_attr( $pagination_class ) . '">'; // Escape the class attribute
$pagination_output .= paginate_links( $p_args ); // Output the pagination links
$pagination_output .= '</div>';

echo $pagination_output; // Output the sanitized HTML
