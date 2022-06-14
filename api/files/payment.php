<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Payment_api extends Files
{
    private $Payment;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for payment table to do operations
        $this->Payment = new Files($db);

        // Set table name
        $this->Payment->table = 'purchase_payment';

        // Set column names
        $this->Payment->id_name = 'payment_id';
        $this->Payment->col_name = 'payment_name';
        $this->Payment->col_type = 'payment_type';
        $this->Payment->col = 'payment';
        $this->Payment->col_date = 'payment_date';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Payment->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['payment'] = base64_encode($row['payment']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about payment found');
            die();
        }
    }

    // Get all the data of payment
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Payment->purchase_id = $id;
        $all_data = $this->Payment->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['payment'] = base64_encode($row['payment']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about payment found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['payment']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Payment->purchase_id = $_GET['ID'];
        $this->Payment->col_name_value = $_FILES['payment']['name'];
        $this->Payment->col_type_value = $_FILES['payment']['type'];
        $this->Payment->col_value = file_get_contents($_FILES['payment']['tmp_name']);
        $this->Payment->col_date_value=$_POST['payment_date'];

        if ($this->Payment->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'payment file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Payment->id = $_GET['ID'];
        if ($this->Payment->delete_row()) {
            send(200, 'message', 'payment file successfully');
        } else {
            send(400, 'error', 'payment file cannot deleted');
        }
    }
}



// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Payment_api = new Payment_api();
    if (isset($_GET['ID'])) {
        $Payment_api->get_by_id($_GET['ID']);
    }else {
        $Payment_api->get();
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Payment_api = new Payment_api();
    $Payment_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Payment_api = new Payment_api();
    $Payment_api->delete_by_id();
}
