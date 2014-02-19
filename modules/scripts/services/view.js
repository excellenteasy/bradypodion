var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('bp').service('bpView', function($rootScope, $state) {
  var BpView;
  BpView = (function() {
    function BpView() {
      this.onViewContentLoaded = __bind(this.onViewContentLoaded, this);
      this.onStateChangeStart = __bind(this.onStateChangeStart, this);
      this.transition = null;
      this.lastTransition = null;
    }

    BpView.prototype.listen = function() {
      $rootScope.$on('$stateChangeStart', this.onStateChangeStart);
      return $rootScope.$on('$viewContentLoaded', this.onViewContentLoaded);
    };

    BpView.prototype.onStateChangeStart = function(event, toState, toParams, fromState, fromParams) {
      var direction, type;
      direction = toParams.direction || this.getDirection(fromState, toState);
      type = toParams.transition || this.getType(fromState, toState, direction);
      return this.setTransition(type, direction);
    };

    BpView.prototype.onViewContentLoaded = function() {
      var $views;
      $views = angular.element('[ui-view], ui-view');
      if (this.transition != null) {
        $views.removeClass(this.lastTransition).addClass(this.transition);
        return this.lastTransition = this.transition;
      } else {
        return $views.removeClass(this.lastTransition);
      }
    };

    BpView.prototype.setTransition = function(type, direction) {
      return this.transition = (type != null) && (direction != null) ? "" + type + "-" + direction : null;
    };

    BpView.prototype.getDirection = function(from, to) {
      var direction, fromSegments, index, segment, toSegments, _i, _len;
      direction = 'normal';
      if (from.url === '^') {
        return null;
      }
      fromSegments = this._getURLSegments(from);
      toSegments = this._getURLSegments(to);
      if (toSegments.length < fromSegments.length) {
        direction = 'reverse';
        for (index = _i = 0, _len = toSegments.length; _i < _len; index = ++_i) {
          segment = toSegments[index];
          if (segment !== fromSegments[index]) {
            direction = 'normal';
            break;
          }
        }
        direction;
      } else if (toSegments.length === fromSegments.length) {
        direction = null;
      }
      return direction;
    };

    BpView.prototype.getType = function(from, to, direction) {
      var _ref, _ref1;
      if (direction === 'reverse') {
        return ((_ref = from.data) != null ? _ref.transition : void 0) || null;
      } else {
        return ((_ref1 = to.data) != null ? _ref1.transition : void 0) || null;
      }
    };

    BpView.prototype._getURLSegments = function(state) {
      var url;
      url = state.url || '';
      url = url.replace(/\/$/, '');
      return url.split('/');
    };

    return BpView;

  })();
  return new BpView();
});
