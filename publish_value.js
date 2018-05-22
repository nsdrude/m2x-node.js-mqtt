const mqtt = require('mqtt')
const m2x_api_key = "";
const m2x_device_id = "";
const client = mqtt.connect('mqtt://' + m2x_api_key + '@api-m2x.att.com')


client.on('connect', () => {
  console.log("Connected");
  var status = client.subscribe("m2x/" + m2x_api_key + "/responses");
})

client.on('message', (topic, message) => {
  console.log('received message %s %s', topic, message)
})

function publish_value(stream_name, value) {
    var endpoint = "/v2/devices/" + m2x_device_id + "/streams/" + stream_name + "/values";
    var request = {};

    request.body = {};
    request.body.values = [{value : value, timestamp: new Date().toISOString()}];
    request.resource = endpoint;
    request.method = "POST";

    console.log("posting: " + stream_name + " = " + value );

    client.publish("m2x/" + m2x_api_key + "/requests", JSON.stringify(request));
}

function post_values() {
    publish_value("temperature", 73);
}

setInterval(post_values, 1500);

function handleAppExit (options, err) {
  if (err) {
    console.log(err.stack)
  }

  if (options.cleanup) {
  }

  if (options.exit) {
    process.exit()
  }
}

process.on('exit', handleAppExit.bind(null, {
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
  exit: true
}))