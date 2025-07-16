<?php
if(! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}
?>

<div class="search-skeleton">
    <div class="search-ssc-lg ssc">
        <div class="ssc-wrapper">
            <div class="ssc-line mb w-40"></div>
        </div>
        <div class="ssc-card ssc-wrapper">
            <div class="flex mbs">
                <div class="search-ssc-lg__tag ssc-square"></div>
                <div class="search-ssc-lg__tag ssc-square"></div>
                <div class="search-ssc-lg__tag ssc-square"></div>
                <div class="search-ssc-lg__tag ssc-square"></div>
                <div class="search-ssc-lg__tag ssc-square"></div>
                <div class="search-ssc-lg__tag ssc-square"></div>
            </div>
        </div>
        <br> <br>
        <div class="ssc-card ssc-wrapper">
            <?php if (isset($inline) && $inline === true) : ?>
                <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $content;
                ?>
            <?php endif; ?>
        </div>
        <br> <br>
        <div class="ssc-card ssc-wrapper">
            <div class="ssc-line w-30 mb"></div> <br>
            <div class="flex align-start justify-between">
                <div class="w-20">
                    <div class="ssc-head-line mb"></div>
                    <div class="ssc-line w-80"></div>
                    <div class="ssc-line w-40"></div>
                    <div class="ssc-line w-60"></div>
                </div>
                <div class="w-20">
                    <div class="ssc-head-line mb"></div>
                    <div class="ssc-line w-80"></div>
                    <div class="ssc-line w-40"></div>
                    <div class="ssc-line w-60"></div>
                </div>
                <div class="w-20">
                    <div class="ssc-head-line mb"></div>
                    <div class="ssc-line w-80"></div>
                    <div class="ssc-line w-40"></div>
                    <div class="ssc-line w-60"></div>
                </div>
                <div class="w-20">
                    <div class="ssc-head-line mb"></div>
                    <div class="ssc-line w-80"></div>
                    <div class="ssc-line w-40"></div>
                    <div class="ssc-line w-60"></div>
                </div>
            </div>
        </div> <br>
        <div class="ssc-hr"></div> <br>
        <div class="flex align-start">
            <div class="ssc-card w-30 mr">
                <div class="ssc-wrapper flex justify-between">
                    <div class="w-60 mr">
                        <div class="ssc-line mb w-50"></div>
                        <div class="ssc-line mb w-70"></div>
                        <div class="ssc-line w-90"></div>
                    </div>
                    <div class="ssc-circle" style="width:70px;height:70px"></div>
                </div>
                <div class="ssc-hr"></div>
                <div class="ssc-wrapper">
                    <div class="flex align-center justify-between">
                        <div class="ssc-head-line w-60 mr"></div>
                        <div class="ssc-line w-30"></div>
                    </div>
                </div>
                <div class="ssc-hr"></div>
                <div class="ssc-wrapper">
                    <div class="ssc-line w-100 mb"></div>
                    <div class="ssc-line w-70 mb"></div>
                    <div class="ssc-line w-30 mb"></div>
                    <div class="ssc-line w-80 mb"></div>
                    <div class="ssc-line w-60 mb"></div>
                </div>
                <div class="ssc-hr"></div>
                <div class="ssc-wrapper">
                    <div class="ssc-line w-100 mb"></div>
                    <div class="ssc-line w-70 mb"></div>
                    <div class="ssc-line w-30 mb"></div>
                    <div class="ssc-line w-80 mb"></div>
                    <div class="ssc-line w-60 mb"></div>
                </div>
                <div class="ssc-hr"></div>
                <div class="ssc-wrapper">
                    <div class="ssc-line w-100 mb"></div>
                    <div class="ssc-line w-70 mb"></div>
                    <div class="ssc-line w-30 mb"></div>
                    <div class="ssc-line w-80 mb"></div>
                    <div class="ssc-line w-60 mb"></div>
                </div>
            </div>
            <div class="w-100">
                <div class="ssc-card ssc-wrapper">
                    <div class="ssc-head-line"></div> <br>
                    <div class="ssc-square"></div>
                </div> <br>
                <div class="ssc-card ssc-wrapper">
                    <div class="ssc-head-line"></div> <br>
                    <div class="ssc-square"></div>
                </div> <br>
                <div class="ssc-card ssc-wrapper">
                    <div class="ssc-head-line"></div> <br>
                    <div class="ssc-square"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="search-ssc-lg ssc">
        <div class="ssc-card ssc-wrapper">
            <div class="ssc-line mb w-70"></div>
        </div> <br>
        <div class="ssc-card ssc-wrapper flex justify-between">
            <div class="w-70 mr">
                <div class="ssc-line mb w-50"></div>
                <div class="ssc-line mb w-70"></div>
                <div class="ssc-line w-90"></div>
            </div>
            <div class="ssc-circle" style="width:70px;height:70px"></div>
        </div> <br>
        <div class="ssc-hr"></div> <br>
        <div class="ssc-card ssc-wrapper">
            <div class="ssc-head-line mb"></div>
            <div class="ssc-square mb"></div>
            <div class="ssc-line mb w-50"></div>
            <div class="ssc-line mb w-80"></div>
            <div class="ssc-line mb w-30"></div>
        </div> <br>

    </div>
</div>