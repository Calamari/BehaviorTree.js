var Frank = new BehaviorTree({
  title: "Frank",
  tree: new BehaviorTree.Sequence({
    nodes: [
      new BehaviorTree.Task({
        title: 'lookaround',
        run: function() {
          var _this = this
          console.log("looking")
          this.success()
        }
      }),
      new BehaviorTree.Random({
        title: 'walk',
        nodes: [
          new BehaviorTree.Task({
            title: 'left',
            run: function() {
              console.log("walk left")
              this.success()
            }
          }),
          new BehaviorTree.Task({
            title: 'up',
            run: function() {
              console.log("walk up")
              this.success()
            }
          }),
          new BehaviorTree.Task({
            title: 'right',
            run: function() {
              console.log("walk right")
              this.success()
            }
          }),
          new BehaviorTree.Task({
            title: 'down',
            run: function() {
              console.log("walk down")
              this.success()
            }
          }),
        ]
      }),
    ]
  })
});

setInterval(function(){
  Frank.step()
}, 2000)
Frank.step()
