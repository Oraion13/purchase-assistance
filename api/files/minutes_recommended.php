<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Minutes_recommended_api extends Files
{
    private $Minutes_recommended;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for minutes recommended table to do operations
        $this->Minutes_recommended = new Files($db);

        // Set table name
        $this->Minutes_recommended->table = 'purchase_minutes_recommended';

        // Set column names
        $this->Minutes_recommended->id_name = 'minutes_recommended_id';
        $this->Minutes_recommended->col_name = 'minutes_recommended_name';
        $this->Minutes_recommended->col_type = 'minutes_recommended_type';
        $this->Minutes_recommended->col = 'minutes_recommended';
        $this->Minutes_recommended->col_date = 'minutes_recommended_date';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Minutes_recommended->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['minutes_recommended'] = base64_encode($row['minutes_recommended']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about minutes recommended found');
            die();
        }
    }

    // Get all the data of minutes recommended
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Minutes_recommended->purchase_id = $id;
        $all_data = $this->Minutes_recommended->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['minutes_recommended'] = base64_encode($row['minutes_recommended']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about minutes recommended found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['minutes_recommended']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Minutes_recommended->purchase_id = $_GET['ID'];
        $this->Minutes_recommended->col_name_value = $_FILES['minutes_recommended']['name'];
        $this->Minutes_recommended->col_type_value = $_FILES['minutes_recommended']['type'];
        $this->Minutes_recommended->col_value = file_get_contents($_FILES['minutes_recommended']['tmp_name']);
        $this->Minutes_recommended->col_date_value=$_POST['minutes_recommended_date'];
        
        if ($this->Minutes_recommended->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'minutes recommended file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Minutes_recommended->id = $_GET['ID'];
        if ($this->Minutes_recommended->delete_row()) {
            send(200, 'message', 'minutes recommended file successfully');
        } else {
            send(400, 'error', 'minutes recommended file cannot deleted');
        }
    }
}



// If admin logged in ...

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Minutes_recommended_api = new Minutes_recommended_api();
    if (isset($_GET['ID'])) {
        $Minutes_recommended_api->get_by_id($_GET['ID']);
    }else {
        $Minutes_recommended_api->get();
    }
}

// To check if admin is logged in
loggedin();

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Minutes_recommended_api = new Minutes_recommended_api();
    $Minutes_recommended_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Minutes_recommended_api = new Minutes_recommended_api();
    $Minutes_recommended_api->delete_by_id();
}
