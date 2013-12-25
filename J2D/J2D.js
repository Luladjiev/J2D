/*global window*/

/**
 * J2D Core
 *
 * @param object J2D
 */
var J2D = (function J2DCore(J2D) {
    'use strict';

    J2D.Renderer = function Renderer(width, height) {
        this.width = width || 300;
        this.height = height || 300;

        this.view = window.document.createElement('canvas');
        this.view.width = this.width;
        this.view.height = this.height;

        this.context = this.view.getContext('2d');
    };

    J2D.Renderer.prototype.Render = function Render(stage, dontClear) {
        var i = 0,
            l = stage.childs.length,
            j,
            len,
            child,
            arg;

        if (!dontClear) {
            this.context.clearRect(0, 0, this.width, this.height);
        }

        this.context.strokeStyle = '#000000';

        for (i; i < l; i += 1) {
            child = stage.childs[i];
            len = child.args.length;

            if (!dontClear || (dontClear && child.repaint)) {
                this.context.beginPath();

                for (j = 0; j < len; j += 1) {
                    arg = child.args[j];
                    if (!j) {
                        this.context.moveTo(arg.x, arg.y);
                    } else {
                        this.context.lineTo(arg.x, arg.y);
                    }
                }

                this.context.closePath();
                this.context.stroke();
                
                child.repaint = false;
            }
        }
    };

    J2D.Stage = function Stage() {
        this.childs = [];
    };

    J2D.Stage.prototype.AddToStage = function AddToStage(child) {
        this.childs.push(child);
    };

    return J2D;
}(J2D || {}));


/**
 * J2D Primitives
 *
 * @param object J2D
 */
var J2D = (function J2DPrimitives(J2D) {
    'use strict';

    J2D.Primitives = function Primitives() {};

    J2D.Primitives.prototype.constructor = J2D.Primitives;

    J2D.Primitives.prototype.Clone = function Clone() {
        switch (this.constructor) {
        case J2D.Primitives.Point:
            return new J2D.Primitives.Point(this.x, this.y);
        case J2D.Primitives.Vector:
            return new J2D.Primitives.Vector(this.x, this.y);
        }
    };

    J2D.Primitives.Point = function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    J2D.Primitives.Point.prototype = Object.create(J2D.Primitives.prototype);
    J2D.Primitives.Point.prototype.constructor = J2D.Primitives.Point;

    J2D.Primitives.Vector = function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    J2D.Primitives.Vector.prototype = Object.create(J2D.Primitives.prototype);
    J2D.Primitives.Vector.prototype.constructor = J2D.Primitives.Vector;

    J2D.Primitives.Line = function Line(point, vector) {
        this.p = point || new J2D.Primitives.Point();
        this.v = vector || new J2D.Primitives.Vector();
    };

    J2D.Primitives.LineSegment = function LineSegment(pointA, pointB) {
        this.a = pointA || new J2D.Primitives.Point();
        this.b = pointB || new J2D.Primitives.Point();
    };

    return J2D;
}(J2D || {}));


/**
 * J2D Graphics
 *
 * @param object J2D
 */
var J2D = (function J2DGraphics(J2D) {
    'use strict';
    
    J2D.Graphics = function Graphics() {
        this.args = [];
        this.repaint = true;
    };

    J2D.Graphics.prototype.Move = function Move(vector) {
        var i = 0,
            l = this.args.length;

        for (i; i < l; i += 1) {
            J2D.Math.MovePoint(this.args[i], vector);
        }

        this.repaint = true;
    };
    
    J2D.Graphics.prototype.Rotate = function Rotate(angle) {
        var i = 0,
            l = this.args.length,
            position = this.GetPosition();

        for (i; i < l; i += 1) {
            J2D.Math.RotatePoint(this.args[i], angle, position);
        }
        
        this.repaint = true;
    };

    J2D.Graphics.prototype.GetPosition = function GetPosition() {
        switch (this.constructor) {
        case J2D.Graphics.Triangle:
            return new J2D.Primitives.Point(
                (this.args[0].x + this.args[1].x + this.args[2].x) / 3,
                (this.args[0].y + this.args[1].y + this.args[2].y) / 3
            );
        case J2D.Graphics.Rectangle:
        case J2D.Graphics.Square:
            return new J2D.Primitives.Point(
                (this.args[0].x + this.args[2].x) / 2,
                (this.args[0].y + this.args[2].y) / 2
            );
        }
    };

    J2D.Graphics.prototype.constructor = J2D.Graphics;
    
    J2D.Graphics.Triangle = function Triangle(pointA, pointB, pointC) {
        J2D.Graphics.call(this);
        
        this.args.push(pointA);
        this.args.push(pointB);
        this.args.push(pointC);
    };

    J2D.Graphics.Triangle.prototype = Object.create(J2D.Graphics.prototype);
    J2D.Graphics.Triangle.prototype.constructor = J2D.Graphics.Triangle;

    J2D.Graphics.Rectangle = function Rectangle(pointA, pointB) {
        J2D.Graphics.call(this);
        
        this.args.push(pointA);
        this.args.push(new J2D.Primitives.Point(pointB.x, pointA.y));
        this.args.push(pointB);
        this.args.push(new J2D.Primitives.Point(pointA.x, pointB.y));
    };

    J2D.Graphics.Rectangle.prototype = Object.create(J2D.Graphics.prototype);
    J2D.Graphics.Rectangle.prototype.constructor = J2D.Graphics.Rectangle;

    J2D.Graphics.Square = function Square(pointA, size) {
        var s = size / 2,
            pointB = pointA.Clone();

        J2D.Math.MovePoint(pointA, new J2D.Primitives.Vector(s * -1, s * -1));
        J2D.Math.MovePoint(pointB, new J2D.Primitives.Vector(s, s));

        J2D.Graphics.Rectangle.call(this, pointA, pointB);
    };

    J2D.Graphics.Square.prototype = Object.create(J2D.Graphics.Rectangle.prototype);
    J2D.Graphics.Square.prototype.constructor = J2D.Graphics.Square;

    J2D.Graphics.Circle = function Circle(point, radius) {

    };

    J2D.Graphics.Circle.prototype = Object.create(J2D.Graphics.prototype);
    J2D.Graphics.Circle.prototype.constructor = J2D.Graphics.Circle;

    return J2D;
}(J2D || {}));


/**
 * J2D Math
 *
 * @param object J2D
 */
var J2D = (function J2DMath(J2D) {
    'use strict';

    J2D.Math = {};

    J2D.Math.DegToRad = function DegToRad(degrees) {
        return degrees * (Math.PI / 180);
    };
    
    J2D.Math.RadToDeg = function RadToDeg(radians) {
        return radians * (180 / Math.PI);
    };
    
    J2D.Math.GetVector = function GetVector(pointA, pointB) {
        return new J2D.Primitives.Vector(pointB.x - pointA.x, pointB.y - pointA.y);
    };
    
    J2D.Math.MovePoint = function MovePoint(point, vector) {
        point.x = point.x + vector.x;
        point.y = point.y + vector.y;
    };
    
    J2D.Math.RotatePoint = function RotatePoint(point, angle, origin) {
        angle = J2D.Math.DegToRad(angle);
        origin = origin || new J2D.Primitives.Point();
        
        var cos = Math.cos(angle),
            sin = Math.sin(angle),
            tmpPoint = point.Clone();

        point.x = cos * (tmpPoint.x - origin.x) - sin * (tmpPoint.y - origin.y) + origin.x;
        point.y = sin * (tmpPoint.x - origin.x) + cos * (tmpPoint.y - origin.y) + origin.y;
    };
    
    return J2D;
}(J2D || {}));