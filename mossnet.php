<?php
include("moss.php");
$userid = "879751986";
$moss = new MOSS($userid);
$moss->setLanguage('javascript');
$moss->addByWildcard('basecode/*');
$moss->addByWildcard('candidates/*');
$moss->setCommentString("This is a test");
print_r($moss->send());
?>