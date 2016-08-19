const AWS = require('aws-sdk');

AWS.config.update({accessKeyId: process.env.AWS_accessKeyId, secretAccessKey: process.env.AWS_secretAccessKey});
AWS.config.update({region: 'us-west-2'});

//  endpoint to connect to postgres db nmodb.cqdxw6kmfwjk.us-west-2.rds.amazonaws.com:5432

// var ec2 = new AWS.EC2({apiVersion: 'latest'});
var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't1.micro',
  MinCount: 1, MaxCount: 1
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);

  // Add tags to the instance
  params = {Resources: [instanceId], Tags: [
    {Key: 'Name', Value: 'instanceName'}
  ]};
  ec2.createTags(params, function(err) {
    console.log("Tagging instance", err ? "failure" : "success");
  });
});

// [1] 32189
