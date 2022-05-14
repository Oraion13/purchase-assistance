<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Note_order_api extends Files
{
    private $Note_order;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for note order table to do operations
        $this->Note_order = new Files($db);

        // Set table name
        $this->Note_order->table = 'purchase_note_order';

        // Set column names
        $this->Note_order->id_name = 'note_order_id';
        $this->Note_order->col_name = 'note_order_name';
        $this->Note_order->col_type = 'note_order_type';
        $this->Note_order->col = 'note_order';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Note_order->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['note_order'] = base64_encode($row['note_order']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about note order found');
            die();
        }
    }

    // Get all the data of note order
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Note_order->purchase_id = $id;
        $all_data = $this->Note_order->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['note_order'] = base64_encode($row['note_order']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about note order found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['note_order']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Note_order->purchase_id = $_GET['ID'];
        $this->Note_order->col_name = $_FILES['note_order']['name'];
        $this->Note_order->col_type = $_FILES['note_order']['type'];
        $this->Note_order->col = file_get_contents($_FILES['note_order']['tmp_name']);

        if ($this->Note_order->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'note order file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Note_order->id = $_GET['ID'];
        if ($this->Note_order->delete_row()) {
            send(200, 'message', 'note order file successfully');
        } else {
            send(400, 'error', 'note order file cannot deleted');
        }
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Note_order_api = new Note_order_api();
    if (isset($_GET['ID'])) {
        $Note_order_api->get_by_id($_GET['ID']);
    }else {
        $Note_order_api->get();
    }
}

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Note_order_api = new Note_order_api();
    $Note_order_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Note_order_api = new Note_order_api();
    $Note_order_api->delete_by_id();
}
