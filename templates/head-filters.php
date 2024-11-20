<?php
// Sanitize nav_layout to allow only specific values
$allowed_layouts = array('100-0', '70-30', '50-50', '30-70');
$nav_layout = isset($nav_layout) && in_array($nav_layout, $allowed_layouts) ? $nav_layout : 'default-layout'; // Fallback to a default layout if necessary

echo '<div class="awcpt-head-nav awcpt-head-nav-' . esc_attr($nav_layout) . '">';

// Check if nav_head_left_elems is not empty and if nav_layout is allowed
if ( ! empty( $nav_head_left_elems ) && in_array($nav_layout, $allowed_layouts) ) {
    include( $this->templates_dir . '/head-left-filters.php' );
}

// Check if nav_head_right_elems is not empty and nav_layout is not '100-0'
if ( ! empty( $nav_head_right_elems ) && $nav_layout !== '100-0' ) {
    include( $this->templates_dir . '/head-right-filters.php' );
}

echo '</div>';
