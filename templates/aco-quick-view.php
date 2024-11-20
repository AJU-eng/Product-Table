<?php
$quick_view_output = '<div class="awcpt-aco-quickview-wrap">';
$quick_view_output .= do_shortcode( "[acoqvw_quickview]" );
$quick_view_output .= '</div>';

echo wp_kses_post($quick_view_output);