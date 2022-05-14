<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Estimation_api extends Files
{
    private $Estimation;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for estimation table to do operations
        $this->Estimation = new Files($db);

        // Set table name
        $this->Estimation->table = 'purchase_estimation';

        // Set column names
        $this->Estimation->id_name = 'estimation_id';
        $this->Estimation->col_name = 'estimation_name';
        $this->Estimation->col_type = 'estimation_type';
        $this->Estimation->col = 'estimation';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Estimation->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['estimation'] = base64_encode($row['estimation']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about estimation found');
            die();
        }
    }

    // Get all the data of estimation
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Estimation->purchase_id = $id;
        $all_data = $this->Estimation->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['estimation'] = base64_encode($row['estimation']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about estimation found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['estimation']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Estimation->purchase_id = $_GET['ID'];
        $this->Estimation->col_name = $_FILES['estimation']['name'];
        $this->Estimation->col_type = $_FILES['estimation']['type'];
        $this->Estimation->col = file_get_contents($_FILES['estimation']['tmp_name']);

        if ($this->Estimation->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'estimation file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Estimation->id = $_GET['ID'];
        if ($this->Estimation->delete_row()) {
            send(200, 'message', 'estimation file successfully');
        } else {
            send(400, 'error', 'estimation file cannot deleted');
        }
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Estimation_api = new Estimation_api();
    if (isset($_GET['ID'])) {
        $Estimation_api->get_by_id($_GET['ID']);
    }else {
        $Estimation_api->get();
    }
}

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Estimation_api = new Estimation_api();
    $Estimation_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Estimation_api = new Estimation_api();
    $Estimation_api->delete_by_id();
}
