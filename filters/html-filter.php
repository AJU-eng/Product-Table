<?php
// Retrieve the HTML value from the element, defaulting to an empty string if not set
$html_val = ! empty( $elem['value'] ) ? $elem['value'] : '';

if ( $html_val ) {
    // Start the output with a div wrapper for the filter
    $html_output = '<div class="awcpt-filter awcpt-filter-html-wrap">';
    
    // Sanitize the HTML value to allow only safe HTML tags
    $html_output .= wp_kses_post( $html_val ); // wp_kses_post allows a predefined set of safe HTML tags
    
    // Close the div wrapper
    $html_output .= '</div>';

    // Echo the sanitized HTML output
    echo $html_output;
} else {
    // If there's no value, return early (no output)
    return;
}
