<?php  
$email=$_POST['emai_ID'];    
$password=$_POST['password'];  
 if ($email&&$password)
 {
     $connect = mysqli_connect("localhost","root","") or die("Couldn't Connect");
     mysqli_select_db($connect,"purchase") or die("Cant find DB");
     
     $query = mysqli_query($connect,"SELECT * FROM login WHERE email_id='$email'");
     
     $numrows = mysqli_num_rows($query);
     
     if ($numrows!=0)
     {
         while($row = mysqli_fetch_assoc($query))
         {
         if ($username == $row['email_id'] && password_verify($password, $row['password']))
         {
               echo "<center>Login Successfull..!! <br/>Redirecting you to HomePage! </br>If not Goto <a href='index.php'> Here </a></center>";
           echo "<meta http-equiv='refresh' content ='3; url=index.php'>";
             //$_SESSION['Name'] = mysqli_query("SELECT Name FROM slogin WHERE USN='$username'");
         } else{
             
         echo "";
            echo "<script type='text/javascript'>alert('$message');</script>";
         echo "<center>Redirecting you back to Login Page! If not Goto <a href='index.html'> Here </a></center>";
          echo "<meta http-equiv='refresh' content ='1; url=index.php'>";
         }
     }
         die("User not exist");
 }
}
 else
 die("Please enter USN and Password");
 ?>
?>  