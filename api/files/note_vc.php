<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Note_vc_api extends Files
{
    private $Note_vc;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for note vc table to do operations
        $this->Note_vc = new Files($db);

        // Set table name
        $this->Note_vc->table = 'purchase_note_vc';

        // Set column names
        $this->Note_vc->id_name = 'note_vc_id';
        $this->Note_vc->col_name = 'note_vc_name';
        $this->Note_vc->col_type = 'note_vc_type';
        $this->Note_vc->col = 'note_vc';
        $this->Note_vc->col_date = 'note_vc_date';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Note_vc->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['note_vc'] = base64_encode($row['note_vc']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about note vc found');
            die();
        }
    }

    // Get all the data of note vc
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Note_vc->purchase_id = $id;
        $all_data = $this->Note_vc->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['note_vc'] = base64_encode($row['note_vc']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about note vc found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['note_vc']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Note_vc->purchase_id = $_GET['ID'];
        $this->Note_vc->col_name_value = $_FILES['note_vc']['name'];
        $this->Note_vc->col_type_value = $_FILES['note_vc']['type'];
        $this->Note_vc->col_value = file_get_contents($_FILES['note_vc']['tmp_name']);
        $this->Note_vc->col_date_value=$_POST['note_vc_date'];

        if ($this->Note_vc->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'note order dean file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Note_vc->id = $_GET['ID'];
        if ($this->Note_vc->delete_row()) {
            send(200, 'message', 'note order dean file successfully');
        } else {
            send(400, 'error', 'note order dean file cannot deleted');
        }
    }
}



// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Note_vc_api = new Note_vc_api();
    if (isset($_GET['ID'])) {
        $Note_vc_api->get_by_id($_GET['ID']);
    }else {
        $Note_vc_api->get();
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Note_vc_api = new Note_vc_api();
    $Note_vc_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Note_vc_api = new Note_vc_api();
    $Note_vc_api->delete_by_id();
}
