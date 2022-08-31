let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
   $.ajax({
    url:"https://api.mapbox.com/directions/v5/mapbox/driving/$%7Bcoordinates.source_lon%7D%2C$%7Bcoordinates.source_lat%7D%3B$%7Bcoordinates.destination_lon%7D%2C$%7Bcoordinates.destination_lat%7D?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA",
    type:"get",
    success: function(response){
        let steps = response.route[0].legs[0].steps
        let images = { 
            "turn_right": "ar_right.png", 
            "turn_left": "ar_left.png", 
            "slight_right": "ar_slight_right.png", 
            "slight_left": "ar_slight_left.png", 
            "straight": "ar_straight.png",
        }
        for(let i = 0; i < steps.length; i++){
            let image;
            let distance = step[i].maneuver.instruction
            if(instruction.include("Turn right")){
                image="Turn right"
          }
            else if(instruction.include("Turn left")){
                image="Turn left"
          }
            if(i > 0){
                $("#scene_container").append(
                    <a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                        <a-image 
                            name="${instruction}" 
                            src="./assets/${images[image]}" 
                            look-at="#step_${i - 1}" 
                            scale="5 5 5" 
                            id="step_${i}" 
                            position="0 0 0" >
                        </a-image>
                        <a-entity>
                            <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                        </a-entity>
                    </a-entity>
                )
          }
          else{
            $("#scene_container").append(
                <a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                    <a-image 
                        name="${instruction}" 
                        src="./assets/${images[image]}" 
                        look-at="#step_${i + 1}" 
                        scale="5 5 5" 
                        id="step_${i}" 
                        position="0 0 0" >
                    </a-image>
                    <a-entity>
                        <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                    </a-entity>
                </a-entity>
            )
          }
       }
    }
  })
}