beforeEach(function (){
  this.addMatchers({
    toBeFunction: function (){
      return Object.prototype.toString.call(this.actual)==='[object Function]';
    }
  });
});
