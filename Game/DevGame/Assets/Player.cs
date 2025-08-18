using UnityEditor.Tilemaps;
using UnityEngine;

//El nombre de la clase debe ser el mismo del de Unity
public class Player : MonoBehaviour
{
    //Inicializar variables
    Animator animator;
    Rigidbody2D body;
    float mov;
    bool seeRight = true;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        //(conectar todas las propiedades del animator)
        animator = GetComponent<Animator>();
        body = GetComponent<Rigidbody2D>();
        //Busca en tu inspector un componente RidigBody
    }

    // Update is called once per frame
    //Ejecutado cada cuadro por segundo (60)
    void Update()
    {
        if (Input.GetKey(KeyCode.K)) 
        {
            animator.Play("PlayerPunch");
        }

        mov = Input.GetAxis("Horizontal");
        animator.SetFloat("MOV", Mathf.Abs(mov));
        body.linearVelocity = new Vector2(mov*5,body.linearVelocity.y);

        if (seeRight && mov < 0) 
        {
            Flip();
        }

        if (!seeRight && mov > 0) 
        {
            Flip();
        }
    }

    void Flip() 
    {
        seeRight = !seeRight;
        Vector3 scale = transform.localScale; //valores del transform de x,y,z
        scale.x *= -1;
        transform.localScale = scale;
    }
}
