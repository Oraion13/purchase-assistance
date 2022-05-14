<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Po_vender_api extends Files
{
    private $Po_vender;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for po vender table to do operations
        $this->Po_vender = new Files($db);

        // Set table name
        $this->Po_vender->table = 'purchase_po_vender';

        // Set column names
        $this->Po_vender->id_name = 'po_vender_id';
        $this->Po_vender->col_name = 'po_vender_name';
        $this->Po_vender->col_type = 'po_vender_type';
        $this->Po_vender->col = 'po_vender';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Po_vender->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['po_vender'] = base64_encode($row['po_vender']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about po vender found');
            die();
        }
    }

    // Get all the data of po vender
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Po_vender->purchase_id = $id;
        $all_data = $this->Po_vender->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['po_vender'] = base64_encode($row['po_vender']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about po vender found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['po_vender']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Po_vender->purchase_id = $_GET['ID'];
        $this->Po_vender->col_name = $_FILES['po_vender']['name'];
        $this->Po_vender->col_type = $_FILES['po_vender']['type'];
        $this->Po_vender->col = file_get_contents($_FILES['po_vender']['tmp_name']);

        if ($this->Po_vender->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'po vender file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Po_vender->id = $_GET['ID'];
        if ($this->Po_vender->delete_row()) {
            send(200, 'message', 'po vender file successfully');
        } else {
            send(400, 'error', 'po vender file cannot deleted');
        }
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Po_vender_api = new Po_vender_api();
    if (isset($_GET['ID'])) {
        $Po_vender_api->get_by_id($_GET['ID']);
    }else {
        $Po_vender_api->get();
    }
}

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Po_vender_api = new Po_vender_api();
    $Po_vender_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Po_vender_api = new Po_vender_api();
    $Po_vender_api->delete_by_id();
}
