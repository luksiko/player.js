<?php
require __DIR__ . '/vendor/autoload.php';

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use DiDom\Document;

$connector = PhpConsole\Connector::getInstance();

$logger = new Logger('channel-name');
$logger->pushHandler(new StreamHandler(__DIR__ . '/app.log', Logger::DEBUG));
$logger->info('LOG!');
$logger->warning('WARNING!');
$logger->error('ERROR!');


$price_from = 800000;
$price_to = 100000000;
$number_of_pages = 1;

$page_urls = [];
for ($i = 1; $i <= $number_of_pages; $i++) {
  $document = new Document('https://kolesa.kz/cars/avtomobili-s-probegom/?price[from]=' . $price_from . '&price[to]=' . $price_to . '&page=' . $i, true);
  $posts = $document->find('.a-el-info-title .list-link');

  foreach ($posts as $post) {
    // echo "https://kolesa.kz" . $post->href, "\n";
    // echo $post->text(), "\n";
    array_push($page_urls, "https://kolesa.kz" . $post->href);
  }
};

foreach ($page_urls as $page_url) {
  $document = new Document($page_url, true);
  $posts = $document->find('.offer__title');
  foreach ($posts as $post) {
    // echo "https://kolesa.kz" . $post->href, "\n";
    echo $post->text(), "\n";
  }
  $rest = substr($page_url, -9);
  echo $rest;

  $req_url = 'https://kolesa.kz/a/ajaxPhones/?id=' . $rest;


  // $opts = array(
  //   'http' => array(
  //     'method'  => 'GET',
  //     'header'  => "Content-Type: application/json, text/plain, */*",
  //     'content' => "id: " . $rest,
  //     "id"  => $rest,
  //     'key' => "getPhones",
  //     'x-requested-with' => 'XMLHttpRequest'
  //   )
  // );

  // $context  = stream_context_create($opts);

  // $result = file_get_contents($req_url, true, $context, -1, 40000);



  // CURL
  // $s = curl_init();

  // curl_setopt($s, CURLOPT_URL, $req_url);
  // curl_setopt($s, CURLOPT_HTTPHEADER, array(
  //   "Content-Type: application/json, text/plain, */*",
  //   "Path: /a/ajaxPhones/?id=" . $rest,
  //   "Authority: kolesa.kz",
  //   "referer: https://kolesa.kz/a/show/" . $rest,
  //   "x-requested-with: XMLHttpRequest",
  //   "key: getPhones",
  // ));
  // curl_setopt($s, CURLOPT_RETURNTRANSFER, true);

  // curl_close($s);

  // print_r($s) . '<br>';
  // echo $result . '<br>';
}

echo '<br><br><br><b>Я Загружен';
?>
<!-- <script>
  return r()(e, null, [{
    key: "getPhones",
    value: function(t) {
      return l.a.get(e.url, {
        params: {
          id: t || e.advertId
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then((function(e) {
        var t = e.data;
        if (!Array.isArray(t.phones)) throw new Error("Не удалось получить телефоны");
        return t.phones
      }))
    }
  }, ])
</script> -->