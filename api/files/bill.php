<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Bill_api extends Files
{
    private $Bill;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for bill table to do operations
        $this->Bill = new Files($db);

        // Set table name
        $this->Bill->table = 'purchase_bill';

        // Set column names
        $this->Bill->id_name = 'bill_id';
        $this->Bill->col_name = 'bill_name';
        $this->Bill->col_type = 'bill_type';
        $this->Bill->col = 'bill';
        $this->Bill->col_date = 'bill_date';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Bill->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['bill'] = base64_encode($row['bill']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about bill found');
            die();
        }
    }

    // Get all the data of bill
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Bill->purchase_id = $id;
        $all_data = $this->Bill->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['bill'] = base64_encode($row['bill']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about bill found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['bill']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Bill->purchase_id = $_GET['ID'];
        $this->Bill->col_name_value = $_FILES['bill']['name'];
        $this->Bill->col_type_value = $_FILES['bill']['type'];
        $this->Bill->col_value = file_get_contents($_FILES['bill']['tmp_name']);
        $this->Bill->col_date_value = $_POST['bill_date'];


        if ($this->Bill->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'bill file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Bill->id = $_GET['ID'];
        if ($this->Bill->delete_row()) {
            send(200, 'message', 'bill file successfully');
        } else {
            send(400, 'error', 'bill file cannot deleted');
        }
    }
}

// If admin logged in ...

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Bill_api = new Bill_api();
    if (isset($_GET['ID'])) {
        $Bill_api->get_by_id($_GET['ID']);
    }else {
        $Bill_api->get();
    }
}


// To check if admin is logged in
loggedin();

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Bill_api = new Bill_api();
    $Bill_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Bill_api = new Bill_api();
    $Bill_api->delete_by_id();
}
