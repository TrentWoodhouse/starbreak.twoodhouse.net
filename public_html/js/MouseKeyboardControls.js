let MouseKeyboardControls = function (domElement ) {
    this.domElement = domElement;

    // if ('pointerLockElement' in document ||
    //     'mozPointerLockElement' in document ||
    //     'webkitPointerLockElement' in document) {
    //     console.log("You're browser doesn't have pointerLock enabled")
    // }

    this.domElement.requestPointerLock = this.domElement.requestPointerLock ||
        this.domElement.mozRequestPointerLock ||
        this.domElement.webkitRequestPointerLock;

    this.domElement.exitPointerLock = this.domElement.exitPointerLock ||
        this.domElement.mozExitPointerLock ||
        this.domElement.webkitRequestPointerLock;

    this.enabled = true;
    this.mouseLock = false;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseXMovement = 0;
    this.mouseYMovement = 0;
    this.mouseXChange = 0;
    this.mouseYChange = 0;

    this.upKey = false;
    this.downKey = false;
    this.rightKey = false;
    this.leftKey = false;
    this.leftMouseDown = false;
    this.rightMouseDown = false;
    this.mouseDragOn = false;

    let viewHalfX = 0;
    let viewHalfY = 0;

    if ( this.domElement !== document ) {

        this.domElement.setAttribute( 'tabindex', - 1 );

    }

    this.handleResize = function () {

        if ( this.domElement === document ) {

            viewHalfX = window.innerWidth / 2;
            viewHalfY = window.innerHeight / 2;

        } else {

            viewHalfX = this.domElement.offsetWidth / 2;
            viewHalfY = this.domElement.offsetHeight / 2;

        }

    };

    this.onMouseDown = function ( event ) {

        if (!this.mouseLock) {
            this.domElement.requestPointerLock();
        }

        if ( this.domElement !== document ) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        switch ( event.button ) {

            case 0: this.leftMouseDown = true; break;
            case 2: this.rightMouseDown = true; break;

        }

        this.mouseDragOn = true;

    };

    this.onMouseUp = function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        switch ( event.button ) {

            case 0: this.leftMouseDown = false; break;
            case 2: this.rightMouseDown = false; break;

        }

        this.mouseDragOn = false;

    };

    this.onMouseMove = function ( event ) {
        if ( this.domElement === document ) {

            this.mouseX = event.pageX - viewHalfX;
            this.mouseY = event.pageY - viewHalfY;

        } else {

            this.mouseX = event.pageX - this.domElement.offsetLeft - viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - viewHalfY;

        }


        this.mouseXMovement = event.movementX;
        this.mouseYMovement = event.movementY;
        if(this.mouseLock){
            this.mouseXChange += event.movementX;
            this.mouseYChange += event.movementY;
        }
    };

    this.onKeyDown = function ( event ) {

        //event.preventDefault();

        switch ( event.keyCode ) {

            case 38: /*up*/
            case 87: /*W*/ this.upKey = true; break;

            case 37: /*left*/
            case 65: /*A*/ this.leftKey = true; break;

            case 40: /*down*/
            case 83: /*S*/ this.downKey = true; break;

            case 39: /*right*/
            case 68: /*D*/ this.rightKey = true; break;

        }

    };

    this.onKeyUp = function ( event ) {

        switch ( event.keyCode ) {

            case 38: /*up*/
            case 87: /*W*/ this.upKey = false; break;

            case 37: /*left*/
            case 65: /*A*/ this.leftKey = false; break;

            case 40: /*down*/
            case 83: /*S*/ this.downKey = false; break;

            case 39: /*right*/
            case 68: /*D*/ this.rightKey = false; break;

        }

    };

    this.lockChange = function ( event ) {
        if (document.pointerLockElement === this.domElement ||
            document.mozPointerLockElement === this.domElement ||
            document.webkitPointerLockElement){
            this.mouseLock = true;
        }
        else {
            this.mouseLock = false;
        }
    };

    this.info = function () {
        return {
            'mouseLock': this.mouseLock,
            'mouseXChange': this.mouseXChange,
            'mouseYChange': this.mouseYChange,
            'upKey': this.upKey,
            'downKey': this.downKey,
            'rightKey': this.rightKey,
            'leftKey': this.leftKey,
            'rightMouseDown': this.rightMouseDown,
            'leftMouseDown': this.leftMouseDown,
            'mouseDragOn': this.mouseDragOn
        };
    };

    function  contextmenu  ( event ) {
        event.preventDefault();
    }

    this.dispose = function () {

        this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
        this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
        this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
        this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );
        document.removeEventListener( 'pointerlockchange', _lockChange, false);
        document.removeEventListener( 'mozpointerlockchange', _lockChange, false);

        window.removeEventListener( 'keydown', _onKeyDown, false );
        window.removeEventListener( 'keyup', _onKeyUp, false );
    };

    let _onMouseMove = bind( this, this.onMouseMove );
    let _onMouseDown = bind( this, this.onMouseDown );
    let _onMouseUp = bind( this, this.onMouseUp );
    let _onKeyDown = bind( this, this.onKeyDown );
    let _onKeyUp = bind( this, this.onKeyUp );
    let _lockChange = bind( this, this.lockChange );

    this.domElement.addEventListener( 'contextmenu', contextmenu, false );
    this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
    this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
    this.domElement.addEventListener( 'mouseup', _onMouseUp, false );
    document.addEventListener( 'pointerlockchange', _lockChange, false);
    document.addEventListener( 'mozpointerlockchange', _lockChange, false);

    window.addEventListener( 'keydown', _onKeyDown, false );
    window.addEventListener( 'keyup', _onKeyUp, false );

    function bind( scope, fn ) {
        return function () {
            fn.apply( scope, arguments );
        };
    }
    this.handleResize();
};

export { MouseKeyboardControls };
