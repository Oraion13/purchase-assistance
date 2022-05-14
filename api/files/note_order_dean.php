<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Note_order_dean_api extends Files
{
    private $Note_order_dean;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for note order dean table to do operations
        $this->Note_order_dean = new Files($db);

        // Set table name
        $this->Note_order_dean->table = 'purchase_note_order_dean';

        // Set column names
        $this->Note_order_dean->id_name = 'note_order_dean_id';
        $this->Note_order_dean->col_name = 'note_order_dean_name';
        $this->Note_order_dean->col_type = 'note_order_dean_type';
        $this->Note_order_dean->col = 'note_order_dean';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Note_order_dean->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['note_order_dean'] = base64_encode($row['note_order_dean']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about note order dean found');
            die();
        }
    }

    // Get all the data of note order dean
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Note_order_dean->purchase_id = $id;
        $all_data = $this->Note_order_dean->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['note_order_dean'] = base64_encode($row['note_order_dean']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about note order dean found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['note_order_dean']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Note_order_dean->purchase_id = $_GET['ID'];
        $this->Note_order_dean->col_name = $_FILES['note_order_dean']['name'];
        $this->Note_order_dean->col_type = $_FILES['note_order_dean']['type'];
        $this->Note_order_dean->col = file_get_contents($_FILES['note_order_dean']['tmp_name']);

        if ($this->Note_order_dean->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'note order dean file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Note_order_dean->id = $_GET['ID'];
        if ($this->Note_order_dean->delete_row()) {
            send(200, 'message', 'note order dean file successfully');
        } else {
            send(400, 'error', 'note order dean file cannot deleted');
        }
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Note_order_dean_api = new Note_order_dean_api();
    if (isset($_GET['ID'])) {
        $Note_order_dean_api->get_by_id($_GET['ID']);
    }else {
        $Note_order_dean_api->get();
    }
}

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Note_order_dean_api = new Note_order_dean_api();
    $Note_order_dean_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Note_order_dean_api = new Note_order_dean_api();
    $Note_order_dean_api->delete_by_id();
}
