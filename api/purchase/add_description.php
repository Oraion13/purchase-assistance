<?php

use Add_description_api as GlobalAdd_description;

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Add_description.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Add_description_api extends Add_description
{
    private $Add_description;

    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for add description to do operations
        $this->Add_description = new Add_description($db);
    }
    // Get all data
    public function get()
    {
        // Get the add description from DB
        $all_data = $this->Add_description->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no add description found');
            die();
        }
    }

    // Get all data of a add description by ID
    public function get_by_id($id)
    {
        // Get the add description from DB
        $this->Add_description->purchase_id = $id;
        $all_data = $this->Add_description->read_row();

        if ($all_data) {
            echo json_encode($all_data);
            die();
        } else {
            send(400, 'error', 'no add description found');
            die();
        }
    }

    // POST a new add description
    public function post()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Add_description->purchase_id = $_GET['ID'];
        $this->Add_description->col_name = $data->col_name;
        $this->Add_description->col_value = $data->col_value;

        // Check for already exists
        $all_data = $this->Add_description->read_row();

        // If no add description exists, insert and get_by_id the data
        if (!$all_data) {
            if ($this->Add_description->post()) {
                $row = $this->get_by_id($_GET['ID']);
            } else {
                send(400, 'error', 'add description cannot be created');
            }
        } else {
            send(400, 'error', 'description already exists for this purchase ID: ' . $_GET['ID']);
        }
    }

    // UPDATE existing add description
    public function update_by_id($DB_data, $to_update, $update_str)
    {
        if (strcmp($DB_data, $to_update) !== 0) {
            if (!$this->Add_description->update_row($update_str)) {
                // If can't update_by_id the data, throw an error message
                send(400, 'error', $update_str . ' cannot be updated');
                die();
            }
        }
    }

    // UPDATE (PUT) a existing user's info
    public function put()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Add_description->purchase_id = $_GET['ID']; // should pass the add description id in URL
        $this->Add_description->col_name = $data->col_name;
        $this->Add_description->col_value = $data->col_value;

        // Get the add description from DB
        $all_data = $this->Add_description->read_row();

        // If add description already exists, update the add description that changed
        if ($all_data) {
            $this->Add_description->id = $all_data['add_description_id'];
            $this->update_by_id($all_data[$data->col_name], $data->col_value, $data->col_name);

            // If updated successfully, get_by_id the data, else throw an error message 
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'no add description found for ID: ' . $_GET['ID']);
        }
    }
}


// GET all the add description
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Add_description_api = new Add_description_api();
    if (isset($_GET['ID'])) {
        $Add_description_api->get_by_id($_GET['ID']);
    } else {
        $Add_description_api->get();
    }
}

// To check if admin is logged in
loggedin();

// If a admin logged in ...

// POST a new add description
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $Add_description_api = new Add_description_api();
    $Add_description_api->post();
}

// UPDATE (PUT) a existing add description
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Add_description_api = new Add_description_api();
    $Add_description_api->put();
}
